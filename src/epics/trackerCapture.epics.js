// @flow
import { combineEpics } from 'redux-observable';

import { loadStartupData } from '../init/entry.epics';
import { loadEnrollmentData, loadFormData } from '../init/enrollment.epics';

export default combineEpics(
    loadStartupData,
    loadEnrollmentData,
    loadFormData,
);
