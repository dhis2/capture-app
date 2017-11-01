// @flow
import { combineEpics } from 'redux-observable';

import { loadStartupData } from '../init/entry.epics';

export default combineEpics(
    loadStartupData,
);
