import { IDBPDatabase, openDB } from 'idb';
import pkg from '../../package.json';
import Schema, { AlbumModel, ItemModel, PhotoModel } from '../../types/Schema';

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

  // Add items

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

  addPhoto: async (photo: PhotoModel & ItemModel) => {
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
    });

    return transaction.done.catch((error) => {
      throw new Error(`Photo ${photo.fileName}: ${error.toString()}`);
    });
  },

  // Remove items

  removeItem: async (itemId: string) => {
    await database.delete('items', itemId);
    await database.delete('albums', itemId);
    await database.delete('photos', itemId);
  },

  // Select items

  selectItem: (itemId: string) => {
    return database.get('items', itemId);
  },

  selectItemsFromParentItemId: (parentItemId: string) => {
    return database.getAllFromIndex('items', 'byParentItemId', parentItemId);
  },

  selectAlbumCount: () => {
    return database
      .transaction('albums', 'readonly')
      .objectStore('albums')
      .count();
  },

  selectAlbumList: () => {
    return database.getAllFromIndex('albums', 'byDateTime');
  },

  selectAlbum: (itemId: string) => {
    return database.get('albums', itemId);
  },

  selectPhotoCount: (albumItemId?: string) => {
    return database
      .transaction('photos', 'readonly')
      .objectStore('photos')
      .index('byAlbumItemId')
      .count(albumItemId);
  },

  selectPhotoKeyList: (albumItemId?: string) => {
    return database.getAllKeysFromIndex('photos', 'byAlbumItemId', albumItemId);
  },

  selectPhotoList: (albumItemId?: string) => {
    return database.getAllFromIndex('photos', 'byAlbumItemId', albumItemId);
  },

  selectPhoto: (itemId: string) => {
    return database.get('photos', itemId);
  },
};

export default Database;
