const sw = (self as unknown) as ServiceWorkerGlobalScope;

const CACHE_ID = 'iris-thumbnail-cache';
const THUMBNAIL_URL = `${sw.location.origin}/thumbnail?itemId=`;
const CLEAR_CACHE_URL = `${sw.location.origin}/thumbnail/clear`;

async function addThumbnail(
  event: FetchEvent,
  itemId: string,
): Promise<Response> {
  const { thumbnailURI } = JSON.parse(await event.request.text());

  if (!thumbnailURI) {
    return new Response('', {
      status: 400,
      statusText: 'thumbnailURI not found',
    });
  }

  const cache = await sw.caches.open(CACHE_ID);
  const thumbnailRequest = new Request(`${THUMBNAIL_URL}${itemId}`);
  const thumbnailResponse = await fetch(thumbnailURI);

  await cache.put(thumbnailRequest, thumbnailResponse);
  return new Response('', { status: 200 });
}

async function removeThumbnail(itemId: string): Promise<Response> {
  const cache = await sw.caches.open(CACHE_ID);
  const thumbnailRequest = new Request(`${THUMBNAIL_URL}${itemId}`);

  if (await cache.match(thumbnailRequest)) {
    await cache.delete(thumbnailRequest);
  }

  return new Response('', { status: 200 });
}

async function getThumbnail(event: FetchEvent): Promise<Response> {
  const cache = await sw.caches.open(CACHE_ID);
  const cachedThumbnail = await cache.match(event.request);
  return cachedThumbnail || new Response('', { status: 404 });
}

sw.addEventListener('fetch', async (event) => {
  if (event.request.url.startsWith(THUMBNAIL_URL)) {
    const url = new URL(event.request.url);
    const itemId = url.searchParams.get('itemId');

    if (!itemId) {
      return;
    }

    switch (event.request.method) {
      case 'PUT':
        return event.waitUntil(event.respondWith(addThumbnail(event, itemId)));
      case 'DELETE':
        return event.waitUntil(event.respondWith(removeThumbnail(itemId)));
      case 'GET':
        return event.waitUntil(event.respondWith(getThumbnail(event)));
    }
  } else if (event.request.url === CLEAR_CACHE_URL) {
    return event.waitUntil(
      event.respondWith(
        (async function () {
          await caches.delete(CACHE_ID);
          return new Response('', { status: 200 });
        })(),
      ),
    );
  }
});
