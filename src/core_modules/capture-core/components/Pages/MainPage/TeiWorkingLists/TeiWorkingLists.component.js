// @flow
import React from 'react';
import { TeiWorkingListsReduxProvider } from './ReduxProvider';

export const TeiWorkingLists = () => (
    <TeiWorkingListsReduxProvider
        storeId={'teiList'}
    />
);
