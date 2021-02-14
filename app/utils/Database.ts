import { IDBPDatabase, openDB } from 'idb';
import pkg from '../../package.json';
import { Album, Item, MetadataFile, Photo, Schema } from '../../types/Schema';

const DATABASE_NAME = 'database';
const DATABASE_VERSION = pkg.version;
let database: IDBPDatabase<Schema>;

export const Database = {
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
        clientId: '',
        accessToken: '',
        accessTokenExpirationTime: 0,
        refreshToken: '',
        refreshTokenExpirationTime: 0,
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

  selectAlbumList: (): Promise<Album[]> => {
    return database
      .transaction('albums', 'readonly')
      .objectStore('albums')
      .index('byDateTime')
      .getAll();
  },

  selectPhoto: async (itemId: string): Promise<Photo | null> => {
    return database
      .transaction('photos', 'readonly')
      .objectStore('photos')
      .get(itemId)
      .then((photo) => photo || null);
  },

  selectPhotoFromIndex: async (
    index: number,
    albumItemId?: string,
  ): Promise<Photo | null> => {
    const photosStore = database
      .transaction('photos', 'readonly')
      .objectStore('photos');

    let cursor;

    if (albumItemId) {
      cursor = await photosStore
        .index('byAlbumItemId')
        .openCursor(albumItemId, 'prev');
    } else {
      cursor = await photosStore.index('byDateTime').openCursor(null, 'prev');
    }

    if (index) {
      await cursor?.advance(index);
    }

    return cursor?.value || null;
  },

  selectPhotoCount: async (albumItemId?: string): Promise<number> => {
    const photosStore = database
      .transaction('photos', 'readonly')
      .objectStore('photos');

    return albumItemId
      ? photosStore.index('byAlbumItemId').count(albumItemId)
      : photosStore.count();
  },

  addItem: (item: Item) => {
    const transaction = database.transaction('items', 'readwrite');

    transaction.objectStore('items').add({
      itemId: item.itemId,
      updateTime: item.updateTime,
      fileName: item.fileName,
    });

    return transaction.done.catch((error) => {
      throw new Error(`Item ${item.fileName}: ${error.toString()}`);
    });
  },

  addAlbum: (album: Album & Item) => {
    const transaction = database.transaction(['items', 'albums'], 'readwrite');

    transaction.objectStore('items').add({
      itemId: album.itemId,
      fileName: album.fileName,
      updateTime: album.updateTime,
    });

    transaction.objectStore('albums').add({
      itemId: album.itemId,
      dateTime: album.dateTime,
      title: album.title,
    });

    return transaction.done.catch((error) => {
      throw new Error(`Album ${album.fileName}: ${error.toString()}`);
    });
  },

  addPhoto: async (
    photo: Omit<Photo, 'thumbnail'> & Item & { thumbnailURI: string },
  ) => {
    const thumbnail = await fetch(photo.thumbnailURI).then((response) =>
      response.arrayBuffer().then((arrayBuffer) => ({
        arrayBuffer,
        contentType: response.headers.get('content-type') || '',
      })),
    );

    const transaction = database.transaction(['items', 'photos'], 'readwrite');

    transaction.objectStore('items').add({
      itemId: photo.itemId,
      fileName: photo.fileName,
      updateTime: photo.updateTime,
    });

    transaction.objectStore('photos').add({
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

  addMetadataFile: (metadataFile: MetadataFile & Item) => {
    const transaction = database.transaction(
      ['items', 'metadataFiles'],
      'readwrite',
    );

    transaction.objectStore('items').add({
      itemId: metadataFile.itemId,
      updateTime: metadataFile.updateTime,
      fileName: metadataFile.fileName,
    });

    transaction.objectStore('metadataFiles').add({
      itemId: metadataFile.itemId,
      photoItemId: metadataFile.photoItemId,
    });

    return transaction.done.catch((error) => {
      throw new Error(
        `Metadata file ${metadataFile.fileName}: ${error.toString()}`,
      );
    });
  },
};
