import {
  DriveItem,
  ThumbnailSet,
  User,
} from '@microsoft/microsoft-graph-types';
import { Client } from '@microsoft/microsoft-graph-client';
import Authentication from './Authentication';

const client = Client.initWithMiddleware({
  authProvider: {
    getAccessToken: () => Authentication.getFreshAccessToken(),
  },
});

async function graphGet<T>(query: string): Promise<T> {
  return client.api(query).get();
}

const Graph = {
  getProfile: () => graphGet<User>('/me'),

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
