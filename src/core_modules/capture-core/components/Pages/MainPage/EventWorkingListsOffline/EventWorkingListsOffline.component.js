// @flow
import React from 'react';
import { EventWorkingListsReduxOffline } from './Redux';
import type { Props } from './EventWorkingListsOffline.types';

export const EventWorkingListsOffline = ({ storeId }: Props) => (
  <EventWorkingListsReduxOffline storeId={storeId} />
);
