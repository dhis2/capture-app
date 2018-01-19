// @flow
import { combineEpics } from 'redux-observable';

import { loadStartupData } from '../init/entry.epics';
import { loadEnrollmentData, loadFormData } from '../init/enrollment.epics';
import { completeFormEpic } from '../components/EventCaptureForm/eventCaptureForm.epics';

export default combineEpics(
    loadStartupData,
    loadEnrollmentData,
    loadFormData,
    completeFormEpic,
);
