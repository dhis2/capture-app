import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'regenerator-runtime'; // To fix the 'regeneratorRuntime is not defined' error comming from react-leaflet-search-unpolyfilled
import 'capture-core-utils/extensions/asyncForEachArray';
import 'capture-core-utils/extensions/arrayToHashMap';
import './locales'; //eslint-disable-line
import { AppStart } from './components/AppStart';

const queryClient = new QueryClient();

export default () => (
    <QueryClientProvider client={queryClient}>
        <AppStart />
    </QueryClientProvider>
);
