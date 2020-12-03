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
    addNoteForNewSingleEventEpic,
    openRelationshipForNewSingleEventEpic,
    addRelationshipForNewSingleEventEpic,
    saveNewEventRelationshipsIfExistsEpic,
    saveNewEventRelationshipFinishedEpic,
    teiForNewEventRelationshipSavedEpic,
} from 'capture-core/components/Pages/NewEvent';
import {
    openNewEventPageLocationChangeEpic,
} from 'capture-core/components/Pages/NewEvent/epics/newEvent.epics';

import {
    initEventListEpic,
    updateEventListEpic,
    retrieveTemplatesEpic,
    requestDeleteEventEpic,
    updateTemplateEpic,
    addTemplateEpic,
    deleteTemplateEpic,
} from 'capture-core/components/Pages/MainPage/EventWorkingLists';

import {
    getEventFromUrlEpic,
    getOrgUnitOnUrlUpdateEpic,
} from 'capture-core/components/Pages/EditEvent/editEvent.epics';
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
    getEventOpeningFromEventListEpic,
    getEventFromUrlEpic as getViewEventFromUrlEpic,
    getOrgUnitOnUrlUpdateEpic as getViewEventOrgUnitOnUrlUpdateEpic,
    openViewPageLocationChangeEpic,
    backToMainPageEpic,
    backToMainPageLocationChangeEpic,
    openAddRelationshipForViewEventEpic,
} from 'capture-core/components/Pages/ViewEvent/epics/viewEvent.epics';

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
    networkMonitorStatusEpic,
} from 'capture-core/components/NetworkStatusBadge/NetworkStatusBadge.epics';
import {
    setOrgUnit,
    setProgram,
    goBackToListContext,
} from 'capture-core/components/LockedSelector/QuickSelector/epics/setSelection.epics';
import {
    searchRegisteringUnitListEpic,
    showRegisteringUnitListIndicatorEpic,
} from 'capture-core/components/LockedSelector/QuickSelector';
import {
    resetProgramAfterSettingOrgUnitIfApplicableEpic,
} from 'capture-core/components/Pages/epics/resetProgramAfterSettingOrgUnitIfApplicable.epic';
import {
    resetCategoriesAfterSettingOrgUnitIfApplicableEpic,
} from 'capture-core/components/Pages/epics/resetCategoriesAfterSettingOrgUnitIfApplicable.epic';
import {
    calculateSelectionsCompletenessEpic,
} from 'capture-core/components/Pages/epics/calculateSelectionsCompleteness.epic';
import {
    includeFiltersWithValueAfterColumnSortingEpic,
} from 'capture-core/components/Pages/MainPage/WorkingListsCommon';
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
import { saveAssigneeEpic } from 'capture-core/components/Pages/ViewEvent/RightColumn/AssigneeSection';

import { loadCoreEpic } from 'capture-core/init';
import { triggerLoadCoreEpic, loadAppEpic, loadCoreFailedEpic } from '../components/AppStart';

import getDataEntryEpics from './getDataEntryEpics';

import {
    updateUrlViaLockedSelectorEpic,
    validateSelectionsBasedOnUrlUpdateEpic,
    getOrgUnitDataBasedOnUrlUpdateEpic,
    setOrgUnitDataEmptyBasedOnUrlUpdateEpic,
    startAgainEpic,
} from '../core_modules/capture-core/components/LockedSelector';
import {
    setTrackedEntityTypeIdOnUrlEpic,
} from '../core_modules/capture-core/components/TrackedEntityTypeSelector/TrackedEntityTypeSelector.epics';
import {
    searchViaUniqueIdOnScopeProgramEpic,
    searchViaUniqueIdOnScopeTrackedEntityTypeEpic,
    searchViaAttributesOnScopeProgramEpic,
    searchViaAttributesOnScopeTrackedEntityTypeEpic,
    startFallbackSearchEpic,
    fallbackSearchEpic,
    fallbackPushPageEpic,
} from '../core_modules/capture-core/components/Pages/Search/SearchForm/SearchForm.epics';
import {
    navigateBackToMainPageEpic,
    openSearchPageLocationChangeEpic,
} from '../core_modules/capture-core/components/Pages/Search/SearchPage.epics';
import {
    startDataEntryInitialisationEpic,
} from '../core_modules/capture-core/components/Pages/New/RegistrationDataEntry/RegistrationDataEntry.epics';

export default combineEpics(
    resetProgramAfterSettingOrgUnitIfApplicableEpic,
    resetCategoriesAfterSettingOrgUnitIfApplicableEpic,
    calculateSelectionsCompletenessEpic,
    triggerLoadCoreEpic,
    loadCoreEpic,
    loadAppEpic,
    loadCoreFailedEpic,
    initEventListEpic,
    updateEventListEpic,
    retrieveTemplatesEpic,
    updateTemplateEpic,
    addTemplateEpic,
    deleteTemplateEpic,
    requestDeleteEventEpic,
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
    getEventOpeningFromEventListEpic,
    networkMonitorStatusEpic,
    goingOnlineEpic,
    setOrgUnit,
    setProgram,
    goBackToListContext,
    includeFiltersWithValueAfterColumnSortingEpic,
    saveNewEventAddAnotherEpic,
    saveNewEventAddAnotherFailedEpic,
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
    runRulesOnEnrollmentFieldUpdateEpic,
    runRulesOnEnrollmentDataEntryFieldUpdateEpic,
    filterFormFieldOrgUnitsEpic,
    asyncUpdateFieldEpic,
    teiSearchFilterOrgUnitsEpic,
    getViewEventFromUrlEpic,
    getViewEventOrgUnitOnUrlUpdateEpic,
    openViewPageLocationChangeEpic,
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
    openNewRelationshipRegisterTeiEpic,
    openNewRelationshipRegisterTeiDataEntryEpic,
    loadSearchGroupDuplicatesForReviewEpic,
    teiForNewEventRelationshipSavedEpic,
    saveAssigneeEpic,
    updateUrlViaLockedSelectorEpic,
    validateSelectionsBasedOnUrlUpdateEpic,
    getOrgUnitDataBasedOnUrlUpdateEpic,
    setOrgUnitDataEmptyBasedOnUrlUpdateEpic,
    startAgainEpic,
    searchViaUniqueIdOnScopeProgramEpic,
    searchViaUniqueIdOnScopeTrackedEntityTypeEpic,
    searchViaAttributesOnScopeProgramEpic,
    searchViaAttributesOnScopeTrackedEntityTypeEpic,
    navigateBackToMainPageEpic,
    openSearchPageLocationChangeEpic,
    startFallbackSearchEpic,
    fallbackSearchEpic,
    fallbackPushPageEpic,
    setTrackedEntityTypeIdOnUrlEpic,
    startDataEntryInitialisationEpic,
    ...getDataEntryEpics(),
);
