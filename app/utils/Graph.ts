import { DriveItem, ThumbnailSet } from '@microsoft/microsoft-graph-types';
import { Client, GraphRequest } from '@microsoft/microsoft-graph-client';
import Authentication from './Authentication';

const tokenRef = { current: '' };

const client = Client.initWithMiddleware({
  authProvider: {
    getAccessToken: async () => tokenRef.current,
  },
});

async function graphAPI(query: string): Promise<GraphRequest> {
  tokenRef.current = await Authentication.getFreshAccessToken();
  console.log(tokenRef.current);
  return client.api(query);
}

async function graphGet<T>(query: string): Promise<T> {
  return (await graphAPI(query)).get();
}

const Graph = {
  getItem: (itemId: string) => graphGet<DriveItem>(`/me/drive/items/${itemId}`),

  getItemChildren: (itemId: string) =>
    graphGet<{ value: DriveItem[] }>(`/me/drive/items/${itemId}/children`).then(
      ({ value }) => value,
    ),

  getItemThumbnails: (itemId: string) =>
    graphGet<{ value: ThumbnailSet[] }>(
      `/me/drive/items/${itemId}/thumbnails`,
    ).then(({ value }) => value[0]),
};

export default Graph;
