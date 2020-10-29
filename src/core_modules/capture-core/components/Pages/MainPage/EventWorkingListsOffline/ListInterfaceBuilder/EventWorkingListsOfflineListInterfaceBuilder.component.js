// @flow
import React from 'react';
import { createOfflineListWrapper } from '../../../../List'; // TODO: Refactor list
import type { Props } from './eventWorkingListsOfflineListInterfaceBuilder.types';

const OfflineListWrapper = createOfflineListWrapper();
export const EventWorkingListsOfflineListInterfaceBuilder = (props: Props) => (
    <OfflineListWrapper
        hasData
        {...props}
    />
);
