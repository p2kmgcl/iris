import { IDBPDatabase, openDB } from 'idb';
import pkg from '../../package.json';
import { Album, Item, Photo, Schema } from '../../types/Schema';

const DATABASE_VERSION = 1;
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

    database = await openDB<Schema>('database', DATABASE_VERSION, {
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
      },
    });

    // Data migration:
    // - Remove old configurations
    // - Populate default data

    for (const key of await database.getAllKeys('configuration')) {
      if (key !== pkg.version) {
        await database.delete('configuration', key);
      }
    }

    if (!(await database.get('configuration', pkg.version))) {
      await database.add('configuration', {
        version: pkg.version,
        clientId: '',
        accessToken: '',
        accessTokenExpirationTime: 0,
        refreshToken: '',
        refreshTokenExpirationTime: 0,
        rootDirectoryId: '',
      });
    }
  },

  getConfiguration: async () => {
    return (await database.get(
      'configuration',
      pkg.version,
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
    await database.add('items', {
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
      response.blob(),
    );

    await database.add('items', {
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
};
