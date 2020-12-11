// @flow
import { typeof effectMethods } from '.';

export type OfflineEffect = {
  url: string,
  data: any,
  method: $Values<effectMethods>,
};
