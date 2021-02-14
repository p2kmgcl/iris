import { DBSchema } from 'idb';

export interface Item {
  itemId: string;
  fileName: string;
  updateTime: number;
}

export interface Album {
  itemId: string;
  title: string;
  dateTime?: number;
}

export interface Photo {
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

export interface MetadataFile {
  itemId: string;
  photoItemId: string;
}

export interface Schema extends DBSchema {
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
  };

  items: {
    key: string;
    value: Item;
  };

  albums: {
    key: string;
    value: Album;
    indexes: {
      byDateTime: number;
    };
  };

  photos: {
    key: string;
    value: Photo;
    indexes: {
      byDateTime: number;
      byAlbumItemId: string;
    };
  };

  metadataFiles: {
    key: string;
    value: MetadataFile;
    indexes: {
      byPhotoItemId: string;
    };
  };
}
