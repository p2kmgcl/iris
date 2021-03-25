import { DBSchema } from 'idb';

export interface ItemModel {
  itemId: string;
  fileName: string;
  parentItemId: string;
  updateTime: number;
}

export interface AlbumModel {
  itemId: string;
  title: string;
  dateTime: number;
  coverItemId: string;
}

export interface PhotoModel {
  itemId: string;
  albumItemId: string;
  fileName: string;
  dateTime: number;
  width: number;
  height: number;
  isVideo: boolean;
  location?: {
    altitude: number;
    latitude: number;
    longitude: number;
  };
}

export default interface Schema extends DBSchema {
  configuration: {
    key: string;
    value: {
      version: string;
      rootDirectoryId: string;
    };
    indexes: {
      byVersion: string;
    };
  };

  items: {
    key: string;
    value: ItemModel;
    indexes: {
      byItemId: string;
      byParentItemId: string;
    };
  };

  albums: {
    key: string;
    value: AlbumModel;
    indexes: {
      byItemId: string;
      byDateTime: number;
    };
  };

  photos: {
    key: string;
    value: PhotoModel;
    indexes: {
      byItemId: string;
      byDateTime: number;
      byAlbumItemId: string;
      byAlbumItemIdAndDate: string;
    };
  };
}
