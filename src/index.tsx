import React from 'react';
import 'regenerator-runtime'; // To fix the 'regeneratorRuntime is not defined' error comming from react-leaflet-search-unpolyfilled
import 'capture-core-utils/extensions/asyncForEachArray';
import 'capture-core-utils/extensions/arrayToHashMap';
import './locales'; //eslint-disable-line
import { AppStart } from './components/AppStart';

export default () => <AppStart />;
