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
        database.createObjectStore('configuration', { keyPath: 'version' });
        database.createObjectStore('items', { keyPath: 'itemId' });

        const albumsStore = database.createObjectStore('albums', {
          keyPath: 'itemId',
        });

        albumsStore.createIndex('byDateTime', 'dateTime', {
          unique: false,
          multiEntry: false,
        });

        const photosStore = database.createObjectStore('photos', {
          keyPath: 'itemId',
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

  selectPhoto: async (itemId: string): Promise<Photo | null> => {
    return (await database.get('photos', itemId)) || null;
  },

  selectPhotos: async (): Promise<Photo[]> => {
    return (await database.getAllFromIndex('photos', 'byDateTime')).reverse();
  },

  addItem: async (item: Item) => {
    await database.add('items', { ...item });
  },

  addAlbum: async (album: Album & Item) => {
    await Database.addItem({
      itemId: album.itemId,
      fileName: album.fileName,
      updateTime: album.updateTime,
    });

    await database.add('albums', {
      itemId: album.itemId,
      dateTime: album.dateTime,
      title: album.title,
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

    await Database.addItem({
      itemId: photo.itemId,
      fileName: photo.fileName,
      updateTime: photo.updateTime,
    });

    await database.add('photos', {
      itemId: photo.itemId,
      dateTime: photo.dateTime,
      height: photo.height,
      width: photo.width,
      isVideo: photo.isVideo,
      albumItemId: photo.albumItemId,
      thumbnail,
    });
  },

  addMetadataFile: async (metadataFile: MetadataFile & Item) => {
    await Database.addItem({
      itemId: metadataFile.itemId,
      updateTime: metadataFile.updateTime,
      fileName: metadataFile.fileName,
    });

    await database.add('metadataFiles', {
      itemId: metadataFile.itemId,
      photoItemId: metadataFile.photoItemId,
    });
  },
};
