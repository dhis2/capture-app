// @flow
import { combineEpics } from 'redux-observable';
import {
    cancelNewEventEpic,
    cancelNewEventLocationChangeEpic,
    cancelNewEventIncompleteSelectionsLocationChangeEpic,
    resetDataEntryForNewEventEpic,
    openNewEventInDataEntryEpic,
    resetRecentlyAddedEventsWhenNewEventInDataEntryEpic,
    runRulesOnUpdateDataEntryFieldForSingleEventEpic,
    runRulesOnUpdateFieldForSingleEventEpic,
    saveNewEventEpic,
    saveNewEventLocationChangeEpic,
    saveNewEventAddAnotherEpic,
    saveNewEventAddAnotherFailedEpic,
    newEventPageSelectorUpdateURLEpic,
    newEventPageSelectorResetURLEpic,
    addNoteForNewSingleEventEpic,
    openRelationshipForNewSingleEventEpic,
    addRelationshipForNewSingleEventEpic,
    saveNewEventRelationshipsIfExistsEpic,
    saveNewEventRelationshipFinishedEpic,
    teiForNewEventRelationshipSavedEpic,
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
    retrieveWorkingListOnMainSelectionsCompletedEpic,
    getWorkingListOnCancelSaveEpic,
    getWorkingListOnSaveEpic,
    updateWorkingListEpic,
    getEventListOnReconnectEpic,
    requestDeleteEventEpic,
} from 'capture-core/components/Pages/MainPage/EventsList/epics/eventsList.epics';
import {
    getEventFromUrlEpic,
    getOrgUnitOnUrlUpdateEpic,
    openEditPageLocationChangeEpic,
    getEventOpeningFromEventListEpic,
} from 'capture-core/components/Pages/EditEvent/epics/editEvent.epics';
import {
    openEditEventInDataEntryEpic,
    runRulesOnUpdateDataEntryFieldForEditSingleEventEpic,
    runRulesOnUpdateFieldForEditSingleEventEpic,
} from 'capture-core/components/Pages/EditEvent/DataEntry/epics/editEventDataEntry.epics';
import {
    loadEditEventDataEntryEpic,
    saveEditedEventEpic,
    saveEditedEventFailedEpic,
} from 'capture-core/components/Pages/ViewEvent/EventDetailsSection/EditEventDataEntry/editEventDataEntry.epics';

import {
    loadViewEventDataEntryEpic,
} from 'capture-core/components/Pages/ViewEvent/EventDetailsSection/ViewEventDataEntry/viewEventDataEntry.epics';
import {
    getEventOpeningFromEventListEpic as getViewEventOpeningFromEventListEpic,
    getEventFromUrlEpic as getViewEventFromUrlEpic,
    getOrgUnitOnUrlUpdateEpic as getViewEventOrgUnitOnUrlUpdateEpic,
    openViewPageLocationChangeEpic,
    backToMainPageEpic,
    backToMainPageLocationChangeEpic,
    openAddRelationshipForViewEventEpic,
} from 'capture-core/components/Pages/ViewEvent/epics/viewEvent.epics';

import {
    viewEventPageSelectorUpdateURLEpic,
} from 'capture-core/components/Pages/ViewEvent/ViewEventSelector/ViewEventSelector.epics';

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
    updateEventListAfterUpdateEventEpic,
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
    searchRegisteringUnitListEpic,
    showRegisteringUnitListIndicatorEpic,
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
import {
    openRelationshipTeiSearchEpic,
    requestRelationshipTeiSearchEpic,
    TeiRelationshipNewOrEditSearchEpic,
} from 'capture-core/components/Pages/NewRelationship/TeiRelationship/teiRelationship.epics';
import {
    teiSearchEpic,
    teiSearchSetProgramEpic,
    teiNewSearchEpic,
    teiSearchChangePageEpic,
} from 'capture-core/components/TeiSearch/epics/teiSearch.epics';
import {
    getOrgUnitDataForNewEnrollmentUrlUpdateEpic,
    emptyOrgUnitForNewEnrollmentUrlUpdateEpic,
    validationForNewEnrollmentUrlUpdateEpic,
    openNewEnrollmentInDataEntryEpic,
    saveNewEnrollmentEpic,
} from 'capture-core/components/Pages/NewEnrollment';
import {
    asyncUpdateFieldEpic,
} from 'capture-core/components/D2Form';
import {
    filterFormFieldOrgUnitsEpic,
} from 'capture-core/components/D2Form/field/Components/OrgUnitField/orgUnitFieldForForms.epics';

import {
    teiSearchFilterOrgUnitsEpic,
} from 'capture-core/components/TeiSearch/SearchOrgUnitSelector/searchOrgUnitSelector.epics';

import {
    loadRelationshipsForViewEventEpic,
    addRelationshipForViewEventEpic,
    saveRelationshipFailedForViewEventEpic,
    relationshipSavedForViewEventEpic,
    deleteRelationshipForViewEventEpic,
    saveRelationshipAfterSavingTeiForViewEventEpic,
    handleViewEventRelationshipSaveTeiFailedEpic,
} from 'capture-core/components/Pages/ViewEvent/Relationship/ViewEventRelationships.epics';

import {
    loadNotesForViewEventEpic,
    addNoteForViewEventEpic,
    saveNoteForViewEventFailedEpic,
} from 'capture-core/components/Pages/ViewEvent/Notes/viewEventNotes.epics';

import {
    openNewRelationshipRegisterTeiEpic,
    openNewRelationshipRegisterTeiDataEntryEpic,
    loadSearchGroupDuplicatesForReviewEpic,
} from 'capture-core/components/Pages/NewRelationship/RegisterTei';

import {
    runRulesOnEnrollmentFieldUpdateEpic,
    runRulesOnEnrollmentDataEntryFieldUpdateEpic,
} from 'capture-core/components/DataEntries';

import { loadCoreEpic } from 'capture-core/init';
import { triggerLoadCoreEpic, loadAppEpic, loadCoreFailedEpic } from '../init/entry.epics';

import getDataEntryEpics from './getDataEntryEpics';

export default combineEpics(
    resetProgramAfterSettingOrgUnitIfApplicableEpic,
    calculateSelectionsCompletenessEpic,
    triggerLoadCoreEpic,
    loadCoreEpic,
    loadAppEpic,
    loadCoreFailedEpic,
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
    runRulesOnUpdateDataEntryFieldForSingleEventEpic,
    runRulesOnUpdateFieldForSingleEventEpic,
    saveNewEventLocationChangeEpic,
    saveNewEventEpic,
    cancelNewEventLocationChangeEpic,
    cancelNewEventEpic,
    cancelNewEventIncompleteSelectionsLocationChangeEpic,
    getEventFromUrlEpic,
    getOrgUnitOnUrlUpdateEpic,
    openEditEventInDataEntryEpic,
    runRulesOnUpdateDataEntryFieldForEditSingleEventEpic,
    runRulesOnUpdateFieldForEditSingleEventEpic,
    saveEditEventLocationChangeEpic,
    saveEditEventEpic,
    cancelEditEventLocationChangeEpic,
    cancelEditEventEpic,
    addNoteForEditSingleEventEpic,
    addNoteForNewSingleEventEpic,
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
    requestDeleteEventEpic,
    searchRegisteringUnitListEpic,
    showRegisteringUnitListIndicatorEpic,
    openRelationshipTeiSearchEpic,
    requestRelationshipTeiSearchEpic,
    TeiRelationshipNewOrEditSearchEpic,
    teiSearchEpic,
    teiSearchChangePageEpic,
    teiSearchSetProgramEpic,
    teiNewSearchEpic,
    openRelationshipForNewSingleEventEpic,
    addRelationshipForNewSingleEventEpic,
    saveNewEventRelationshipsIfExistsEpic,
    saveNewEventRelationshipFinishedEpic,
    getOrgUnitDataForNewEnrollmentUrlUpdateEpic,
    emptyOrgUnitForNewEnrollmentUrlUpdateEpic,
    validationForNewEnrollmentUrlUpdateEpic,
    openNewEnrollmentInDataEntryEpic,
    runRulesOnEnrollmentFieldUpdateEpic,
    runRulesOnEnrollmentDataEntryFieldUpdateEpic,
    saveNewEnrollmentEpic,
    filterFormFieldOrgUnitsEpic,
    asyncUpdateFieldEpic,
    teiSearchFilterOrgUnitsEpic,
    getViewEventOpeningFromEventListEpic,
    getViewEventFromUrlEpic,
    getViewEventOrgUnitOnUrlUpdateEpic,
    openViewPageLocationChangeEpic,
    viewEventPageSelectorUpdateURLEpic,
    backToMainPageEpic,
    backToMainPageLocationChangeEpic,
    openAddRelationshipForViewEventEpic,
    addRelationshipForViewEventEpic,
    saveRelationshipFailedForViewEventEpic,
    relationshipSavedForViewEventEpic,
    deleteRelationshipForViewEventEpic,
    saveRelationshipAfterSavingTeiForViewEventEpic,
    handleViewEventRelationshipSaveTeiFailedEpic,
    addNoteForViewEventEpic,
    saveNoteForViewEventFailedEpic,
    loadNotesForViewEventEpic,
    loadRelationshipsForViewEventEpic,
    loadViewEventDataEntryEpic,
    loadEditEventDataEntryEpic,
    saveEditedEventEpic,
    saveEditedEventFailedEpic,
    updateEventListAfterUpdateEventEpic,
    openNewRelationshipRegisterTeiEpic,
    openNewRelationshipRegisterTeiDataEntryEpic,
    loadSearchGroupDuplicatesForReviewEpic,
    teiForNewEventRelationshipSavedEpic,
    ...getDataEntryEpics(),
);
