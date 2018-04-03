// @flow
import { combineEpics } from 'redux-observable';

import { loadEnrollmentData, loadDataEntryData } from 'capture-core/actions/__TEMP__/enrollment.epics';
import {
    loadDataEntryEpic,
    completeEventEpic,
    saveEventEpic,
    rulesEpic,
} from 'capture-core/components/DataEntry/epics/dataEntry.epics';

import { loadStartupData } from '../init/entry.epics';

export default combineEpics(
    loadStartupData,
    loadEnrollmentData,
    loadDataEntryData,
    loadDataEntryEpic,
    completeEventEpic,
    saveEventEpic,
    rulesEpic,
);
