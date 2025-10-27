import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Fix Leaflet default icon paths for production
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'regenerator-runtime'; // To fix the 'regeneratorRuntime is not defined' error comming from react-leaflet-search-unpolyfilled
import 'capture-core-utils/extensions/asyncForEachArray';
import 'capture-core-utils/extensions/arrayToHashMap';
import './locales'; //eslint-disable-line
import { AppStart } from './components/AppStart';

// eslint-disable-next-line no-underscore-dangle
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
});

const queryClient = new QueryClient();

export default () => (
    <QueryClientProvider client={queryClient}>
        <AppStart />
    </QueryClientProvider>
);
