// @flow
import { combineEpics } from 'redux-observable';
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
} from 'capture-core/components/Pages/NewEvent/epics/newEventSelections.epics';
import {
    openNewEventPageLocationChangeEpic,
} from 'capture-core/components/Pages/NewEvent/epics/newEvent.epics';
import {
    openNewEventInDataEntryEpic,
    runRulesForSingleEventEpic,
} from 'capture-core/components/Pages/NewEvent/DataEntry/epics/newEventDataEntry.epics';
import {
    saveNewEventEpic,
    saveNewEventLocationChangeEpic,
} from 'capture-core/components/Pages/NewEvent/DataEntry/epics/saveNewSingleEvent.epics';
import {
    cancelNewEventEpic,
    cancelNewEventLocationChangeEpic,
} from 'capture-core/components/Pages/NewEvent/DataEntry/epics/cancelNewSingleEvent.epics';
import {
    cancelNewEventIncompleteSelectionsLocationChangeEpic,
} from 'capture-core/components/Pages/NewEvent/DataEntry/epics/cancelNewSingleEventSelectionsIncomplete.epics';
import {
    retrieveWorkingListOnMainSelectionsCompletedEpic,
    getWorkingListOnCancelSaveEpic,
    getWorkingListOnSaveEpic,
    updateWorkingListEpic,
    getEventListOnReconnectEpic,
} from 'capture-core/components/Pages/MainPage/EventsList/eventsList.epics';
import {
    getEventFromUrlEpic,
    getOrgUnitOnUrlUpdateEpic,
    openEditPageLocationChangeEpic,
    getEventOpeningFromEventListEpic,
} from 'capture-core/components/Pages/EditEvent/epics/editEvent.epics';
import {
    openEditEventInDataEntryEpic,
    runRulesForEditSingleEventEpic,
} from 'capture-core/components/Pages/EditEvent/DataEntry/epics/editEventDataEntry.epics';
import {
    saveEditEventEpic,
    saveEditEventLocationChangeEpic,
} from 'capture-core/components/Pages/EditEvent/DataEntry/epics/saveEditSingleEvent.epics';
import {
    cancelEditEventEpic,
    cancelEditEventLocationChangeEpic,
} from 'capture-core/components/Pages/EditEvent/DataEntry/epics/cancelEditSingleEvent.epics';
import {
    goingOnlineEpic,
} from 'capture-core/components/Connectivity/connectivity.epics';
import {
    updateEventListAfterSaveOrUpdateEventEpic,
} from 'capture-core/components/Pages/MainPage/mainPage.epics';

import { loadStartupData } from '../init/entry.epics';

export default combineEpics(
    loadStartupData,
    mainSelectionsCompletedEpic,
    orgUnitDataRetrivedEpic,
    retrieveWorkingListOnMainSelectionsCompletedEpic,
    getWorkingListOnCancelSaveEpic,
    getWorkingListOnSaveEpic,
    updateWorkingListEpic,
    getEventListOnReconnectEpic,
    mainSelectionsFromUrlGetOrgUnitDataEpic,
    mainSelectionsFromUrlEmptyOrgUnitEpic,
    mainSelectionsFromUrlValidationEpic,
    selectionsFromUrlGetOrgUnitDataForNewEventEpic,
    selectionsFromUrlEmptyOrgUnitForNewEventEpic,
    selectionsFromUrlValidationForNewEventEpic,
    openNewEventPageLocationChangeEpic,
    openNewEventInDataEntryEpic,
    runRulesForSingleEventEpic,
    saveNewEventLocationChangeEpic,
    saveNewEventEpic,
    cancelNewEventLocationChangeEpic,
    cancelNewEventEpic,
    cancelNewEventIncompleteSelectionsLocationChangeEpic,
    getEventFromUrlEpic,
    getOrgUnitOnUrlUpdateEpic,
    openEditEventInDataEntryEpic,
    runRulesForEditSingleEventEpic,
    saveEditEventLocationChangeEpic,
    saveEditEventEpic,
    cancelEditEventLocationChangeEpic,
    cancelEditEventEpic,
    openEditPageLocationChangeEpic,
    getEventOpeningFromEventListEpic,
    goingOnlineEpic,
    updateEventListAfterSaveOrUpdateEventEpic,
);
