// @flow
import { combineEpics } from 'redux-observable';

import { loadEnrollmentData, loadDataEntryData } from 'capture-core/actions/__TEMP__/enrollment.epics';
import {
    loadDataEntryEpic,
    completeEventEpic,
    saveEventEpic,
} from 'capture-core/components/DataEntry/epics/dataEntry.epics';
import {
    mainSelectionsCompletedEpic,
    orgUnitDataRetrivedEpic,
    mainSelectionsFromUrlGetOrgUnitDataEpic,
    mainSelectionsFromUrlEmptyOrgUnitEpic,
    mainSelectionsFromUrlValidationEpic,
} from 'capture-core/components/Pages/MainPage/mainSelections.epics';
import {
    selectionsFromUrlGetOrgUnitDataForNewEventEpic,
    selectionsFromUrlEmptyOrgUnitForNewEventEpic,
    selectionsFromUrlValidationForNewEventEpic,
} from 'capture-core/components/Pages/NewEvent/newEventSelections.epics';
import {
    openNewEventInDataEntryEpic,
    runRulesForSingleEventEpic,
} from 'capture-core/components/Pages/NewEvent/DataEntry/newEventDataEntry.epics';
import {
    retrieveWorkingListEpic,
    updateWorkingListEpic,
} from 'capture-core/components/Pages/MainPage/EventsList/eventsList.epics';

import { loadStartupData } from '../init/entry.epics';

export default combineEpics(
    loadStartupData,
    loadEnrollmentData,
    loadDataEntryData,
    loadDataEntryEpic,
    completeEventEpic,
    saveEventEpic,
    mainSelectionsCompletedEpic,
    orgUnitDataRetrivedEpic,
    retrieveWorkingListEpic,
    updateWorkingListEpic,
    mainSelectionsFromUrlGetOrgUnitDataEpic,
    mainSelectionsFromUrlEmptyOrgUnitEpic,
    mainSelectionsFromUrlValidationEpic,
    selectionsFromUrlGetOrgUnitDataForNewEventEpic,
    selectionsFromUrlEmptyOrgUnitForNewEventEpic,
    selectionsFromUrlValidationForNewEventEpic,
    openNewEventInDataEntryEpic,
    runRulesForSingleEventEpic,
);
