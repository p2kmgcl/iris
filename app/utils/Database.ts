import { IDBPDatabase, openDB } from 'idb';
import pkg from '../../package.json';
import Schema, {
  AlbumModel,
  ItemModel,
  MetadataFileModel,
  PhotoModel,
} from '../../types/Schema';

const DATABASE_NAME = 'database';
const DATABASE_VERSION = pkg.version;
let database: IDBPDatabase<Schema>;

const Database = {
  open: async () => {
    if (!(await navigator.storage?.persisted())) {
      await navigator.storage?.persist();
    }

    if (!(await navigator.storage?.persisted())) {
      console.warn(
        'Application storage is not persistent. ' +
          'Your data might be lost at any point if your browser needs to ' +
          'make some extra space. However, you can continue using all ' +
          'features.',
      );
    }

    database = await openDB<Schema>(DATABASE_NAME, 1, {
      async upgrade(database) {
        const configurationStore = database.createObjectStore('configuration', {
          keyPath: 'version',
        });

        configurationStore.createIndex('byVersion', 'version', {
          unique: true,
          multiEntry: false,
        });

        const itemsStore = database.createObjectStore('items', {
          keyPath: 'itemId',
        });

        itemsStore.createIndex('byItemId', 'itemId', {
          unique: true,
          multiEntry: false,
        });

        itemsStore.createIndex('byParentItemId', 'parentItemId', {
          unique: false,
          multiEntry: false,
        });

        const albumsStore = database.createObjectStore('albums', {
          keyPath: 'itemId',
        });

        albumsStore.createIndex('byItemId', 'itemId', {
          unique: true,
          multiEntry: false,
        });

        albumsStore.createIndex('byDateTime', 'dateTime', {
          unique: false,
          multiEntry: false,
        });

        const photosStore = database.createObjectStore('photos', {
          keyPath: 'itemId',
        });

        photosStore.createIndex('byItemId', 'itemId', {
          unique: true,
          multiEntry: false,
        });

        photosStore.createIndex('byDateTime', 'dateTime', {
          unique: false,
          multiEntry: false,
        });

        photosStore.createIndex('byAlbumItemId', 'albumItemId', {
          unique: false,
          multiEntry: false,
        });

        const metadataFilesStore = database.createObjectStore('metadataFiles', {
          keyPath: 'itemId',
        });

        metadataFilesStore.createIndex('byItemId', 'itemId', {
          unique: true,
          multiEntry: false,
        });

        metadataFilesStore.createIndex('byPhotoItemId', 'photoItemId', {
          unique: true,
          multiEntry: false,
        });
      },
    });

    // Data migration:
    // - Clear old databases
    // - Populate default data

    if (!(await database.get('configuration', DATABASE_VERSION))) {
      if ((await database.getAll('configuration')).length) {
        for (const key of await database.getAllKeys('configuration')) {
          if (key !== pkg.version) {
            await database.delete('configuration', key);
          }
        }

        await Database.destroy();
      }

      await database.add('configuration', {
        version: DATABASE_VERSION,
        rootDirectoryId: '',
      });
    }
  },

  destroy: () =>
    new Promise(() => {
      const request = indexedDB.deleteDatabase(DATABASE_NAME);
      const handler = () => window.location.reload();

      request.onsuccess = handler;
      request.onerror = handler;
      request.onblocked = handler;
    }),

  getConfiguration: async () => {
    return (await database.get(
      'configuration',
      DATABASE_VERSION,
    )) as Schema['configuration']['value'];
  },

  setConfiguration: async (
    configuration: Partial<Schema['configuration']['value']>,
  ) => {
    const existingConfiguration = await Database.getConfiguration();

    await database.put('configuration', {
      ...existingConfiguration,
      ...configuration,
    });
  },

  selectItem: async (itemId: string) => {
    return database.get('items', itemId);
  },

  selectItemsFromParentItemId: async (parentItemId: string) => {
    return database
      .transaction('items', 'readonly')
      .objectStore('items')
      .index('byParentItemId')
      .getAll(parentItemId);
  },

  selectAlbumList: (): Promise<AlbumModel[]> => {
    return database
      .transaction('albums', 'readonly')
      .objectStore('albums')
      .index('byDateTime')
      .getAll();
  },

  selectAlbum: async (itemId: string): Promise<AlbumModel | null> => {
    return database
      .transaction('albums', 'readonly')
      .objectStore('albums')
      .get(itemId)
      .then((album) => album || null);
  },

  selectMetadataFile: (itemId: string): Promise<MetadataFileModel | null> => {
    return database
      .transaction('metadataFiles', 'readonly')
      .objectStore('metadataFiles')
      .get(itemId)
      .then((metadataFile) => metadataFile || null);
  },

  selectPhoto: async (itemId: string): Promise<PhotoModel | null> => {
    return database
      .transaction('photos', 'readonly')
      .objectStore('photos')
      .get(itemId)
      .then((photo) => photo || null);
  },

  selectPhotosFromIndex: async (
    from: number,
    to: number,
    albumItemId: string | null = null,
  ): Promise<PhotoModel[]> => {
    const photosStore = database
      .transaction('photos', 'readonly')
      .objectStore('photos');

    const photos: PhotoModel[] = [];

    if (albumItemId) {
      let cursor = await photosStore
        .index('byAlbumItemId')
        .openCursor(albumItemId, 'prev');

      if (cursor && from) {
        cursor = await cursor.advance(from);
      }

      let position = from;

      while (position < to && cursor) {
        photos.push(cursor.value);
        cursor = await cursor.continue();
        position++;
      }
    } else {
      let cursor = await photosStore
        .index('byDateTime')
        .openCursor(null, 'prev');

      if (cursor && from) {
        cursor = await cursor.advance(from);
      }

      let position = from;

      while (position < to && cursor) {
        photos.push(cursor.value);
        cursor = await cursor.continue();
        position++;
      }
    }

    return photos;
  },

  selectPhotoCount: async (
    albumItemId: string | null = null,
  ): Promise<number> => {
    const photosStore = database
      .transaction('photos', 'readonly')
      .objectStore('photos');

    return albumItemId
      ? photosStore.index('byAlbumItemId').count(albumItemId)
      : photosStore.count();
  },

  addItem: (item: ItemModel) => {
    const transaction = database.transaction('items', 'readwrite');

    transaction.objectStore('items').put({
      itemId: item.itemId,
      parentItemId: item.parentItemId,
      updateTime: item.updateTime,
      fileName: item.fileName,
    });

    return transaction.done.catch((error) => {
      throw new Error(`Item ${item.fileName}: ${error.toString()}`);
    });
  },

  removeItem: async (itemId: string) => {
    await database.delete('items', itemId);
    await database.delete('albums', itemId);
    await database.delete('photos', itemId);
    await database.delete('metadataFiles', itemId);
  },

  addAlbum: (album: AlbumModel & ItemModel) => {
    const transaction = database.transaction(['items', 'albums'], 'readwrite');

    transaction.objectStore('items').put({
      itemId: album.itemId,
      parentItemId: album.parentItemId,
      fileName: album.fileName,
      updateTime: album.updateTime,
    });

    transaction.objectStore('albums').put({
      itemId: album.itemId,
      dateTime: album.dateTime,
      title: album.title,
      coverItemId: album.coverItemId,
    });

    return transaction.done.catch((error) => {
      throw new Error(`Album ${album.fileName}: ${error.toString()}`);
    });
  },

  addPhoto: async (
    photo: Omit<PhotoModel, 'thumbnail'> & ItemModel & { thumbnailURI: string },
  ) => {
    const thumbnail = await fetch(photo.thumbnailURI).then((response) =>
      response.arrayBuffer().then((arrayBuffer) => ({
        arrayBuffer,
        contentType: response.headers.get('content-type') || '',
      })),
    );

    const transaction = database.transaction(['items', 'photos'], 'readwrite');

    transaction.objectStore('items').put({
      itemId: photo.itemId,
      parentItemId: photo.parentItemId,
      fileName: photo.fileName,
      updateTime: photo.updateTime,
    });

    transaction.objectStore('photos').put({
      itemId: photo.itemId,
      dateTime: photo.dateTime,
      height: photo.height,
      width: photo.width,
      isVideo: photo.isVideo,
      albumItemId: photo.albumItemId,
      thumbnail,
    });

    return transaction.done.catch((error) => {
      throw new Error(`Photo ${photo.fileName}: ${error.toString()}`);
    });
  },

  addMetadataFile: async (
    metadataFile: Omit<MetadataFileModel, 'content'> &
      ItemModel & { contentURI: string },
  ) => {
    const content = await fetch(metadataFile.contentURI).then((response) =>
      response.text(),
    );

    const transaction = database.transaction(
      ['items', 'metadataFiles'],
      'readwrite',
    );

    transaction.objectStore('items').put({
      itemId: metadataFile.itemId,
      parentItemId: metadataFile.parentItemId,
      updateTime: metadataFile.updateTime,
      fileName: metadataFile.fileName,
    });

    transaction.objectStore('metadataFiles').put({
      itemId: metadataFile.itemId,
      photoItemId: metadataFile.photoItemId,
      content,
    });

    return transaction.done.catch((error) => {
      throw new Error(
        `Metadata file ${metadataFile.fileName}: ${error.toString()}`,
      );
    });
  },
};

export default Database;
