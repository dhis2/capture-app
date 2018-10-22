// @flow
import { combineEpics } from 'redux-observable';
import {
    cancelNewEventEpic,
    cancelNewEventLocationChangeEpic,
    cancelNewEventIncompleteSelectionsLocationChangeEpic,
    newEventAsyncUpdateFieldEpic,
    resetDataEntryForNewEventEpic,
    openNewEventInDataEntryEpic,
    resetRecentlyAddedEventsWhenNewEventInDataEntryEpic,
    runRulesForSingleEventEpic,
    saveNewEventEpic,
    saveNewEventLocationChangeEpic,
    saveNewEventAddAnotherEpic,
    saveNewEventAddAnotherFailedEpic,
    newEventPageSelectorUpdateURLEpic,
    newEventPageSelectorResetURLEpic,
} from 'capture-core/components/Pages/NewEvent';
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
    editEventAsyncUpdateFieldEpic,
} from 'capture-core/components/Pages/EditEvent/DataEntry/epics/editEventAsyncUpdateField.epics';
import {
    retrieveWorkingListOnMainSelectionsCompletedEpic,
    getWorkingListOnCancelSaveEpic,
    getWorkingListOnSaveEpic,
    updateWorkingListEpic,
    getEventListOnReconnectEpic,
} from 'capture-core/components/Pages/MainPage/EventsList/epics/eventsList.epics';
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
    addNoteForEditSingleEventEpic,
    removeNoteForEditSingleEventEpic,
} from 'capture-core/components/Pages/EditEvent/DataEntry/epics/addNoteForEditSingleEvent.epics';
import {
    goingOnlineEpic,
} from 'capture-core/components/Connectivity/connectivity.epics';
import {
    updateEventListAfterSaveOrUpdateEventEpic,
} from 'capture-core/components/Pages/MainPage/mainPage.epics';
import {
    networkMonitorStatusEpic,
} from 'capture-core/components/NetworkStatusBadge/NetworkStatusBadge.epics';
import {
    setOrgUnit,
    setProgram,
    goBackToListContext,
} from 'capture-core/components/QuickSelector/epics/setSelection.epics';
import {
    loadRegisteringUnitListRootsEpic,
} from 'capture-core/components/QuickSelector';
import {
    resetProgramAfterSettingOrgUnitIfApplicableEpic,
} from 'capture-core/components/Pages/epics/resetProgramAfterSettingOrgUnitIfApplicable.epic';
import {
    calculateSelectionsCompletenessEpic,
} from 'capture-core/components/Pages/epics/calculateSelectionsCompleteness.epic';
import {
    mainPageSelectorUpdateURLEpic,
} from 'capture-core/components/Pages/MainPage/MainPageSelector/MainPageSelector.epics';
import {
    editEventPageSelectorUpdateURLEpic,
} from 'capture-core/components/Pages/EditEvent/EditEventSelector/EditEventSelector.epics';
import {
    includeFiltersWithValueAfterColumnSortingEpic,
} from 'capture-core/components/Pages/MainPage/EventsList/FilterSelectors/filterSelector.epics';

import { loadStartupData, loadStartupDataCore } from '../init/entry.epics';

export default combineEpics(
    resetProgramAfterSettingOrgUnitIfApplicableEpic,
    calculateSelectionsCompletenessEpic,
    loadStartupData,
    loadStartupDataCore,
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
    resetDataEntryForNewEventEpic,
    resetRecentlyAddedEventsWhenNewEventInDataEntryEpic,
    runRulesForSingleEventEpic,
    saveNewEventLocationChangeEpic,
    saveNewEventEpic,
    cancelNewEventLocationChangeEpic,
    cancelNewEventEpic,
    newEventAsyncUpdateFieldEpic,
    editEventAsyncUpdateFieldEpic,
    cancelNewEventIncompleteSelectionsLocationChangeEpic,
    getEventFromUrlEpic,
    getOrgUnitOnUrlUpdateEpic,
    openEditEventInDataEntryEpic,
    runRulesForEditSingleEventEpic,
    saveEditEventLocationChangeEpic,
    saveEditEventEpic,
    cancelEditEventLocationChangeEpic,
    cancelEditEventEpic,
    addNoteForEditSingleEventEpic,
    removeNoteForEditSingleEventEpic,
    openEditPageLocationChangeEpic,
    getEventOpeningFromEventListEpic,
    networkMonitorStatusEpic,
    goingOnlineEpic,
    updateEventListAfterSaveOrUpdateEventEpic,
    setOrgUnit,
    setProgram,
    goBackToListContext,
    mainPageSelectorUpdateURLEpic,
    editEventPageSelectorUpdateURLEpic,
    newEventPageSelectorUpdateURLEpic,
    newEventPageSelectorResetURLEpic,
    includeFiltersWithValueAfterColumnSortingEpic,
    saveNewEventAddAnotherEpic,
    saveNewEventAddAnotherFailedEpic,
    loadRegisteringUnitListRootsEpic,
);
