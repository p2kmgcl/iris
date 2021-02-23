import { PhotoModel } from './Schema';

export interface LoadedPhotoModel extends PhotoModel {
  thumbnailURL: string;
}
