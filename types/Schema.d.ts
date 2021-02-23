import { DBSchema } from 'idb';

export interface ItemModel {
  itemId: string;
  fileName: string;
  updateTime: number;
}

export interface AlbumModel {
  itemId: string;
  title: string;
  dateTime: number;
}

export interface PhotoModel {
  itemId: string;
  albumItemId: string;
  dateTime: number;
  thumbnail: {
    arrayBuffer: ArrayBuffer;
    contentType: string;
  };
  width: number;
  height: number;
  isVideo: boolean;
}

export interface MetadataFileModel {
  itemId: string;
  photoItemId: string;
}

export default interface Schema extends DBSchema {
  configuration: {
    key: string;
    value: {
      version: string;
      clientId: string;
      accessToken: string;
      accessTokenExpirationTime: number;
      refreshToken: string;
      refreshTokenExpirationTime: number;
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
    };
  };

  metadataFiles: {
    key: string;
    value: MetadataFileModel;
    indexes: {
      byItemId: string;
      byPhotoItemId: string;
    };
  };
}
