// @flow
import { combineEpics } from 'redux-observable';
import {
    cancelNewEventEpic,
    cancelNewEventLocationChangeEpic,
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
} from '../core_modules/capture-core/components/DataEntries/SingleEventRegistrationEntry';
import {
    openNewEventPageLocationChangeEpic,
} from '../core_modules/capture-core/components/DataEntries/SingleEventRegistrationEntry/SingleEventRegistrationEntry.epics';

import {
    initEventListEpic,
    updateEventListEpic,
    retrieveTemplatesEpic,
    requestDeleteEventEpic,
    updateTemplateEpic,
    addTemplateEpic,
    deleteTemplateEpic,
} from '../core_modules/capture-core/components/Pages/MainPage/EventWorkingLists';

import {
    getEventFromUrlEpic,
    getOrgUnitOnUrlUpdateEpic,
} from '../core_modules/capture-core/components/Pages/EditEvent/editEvent.epics';
import {
    openEditEventInDataEntryEpic,
    runRulesOnUpdateDataEntryFieldForEditSingleEventEpic,
    runRulesOnUpdateFieldForEditSingleEventEpic,
} from '../core_modules/capture-core/components/Pages/EditEvent/DataEntry/epics/editEventDataEntry.epics';
import {
    loadEditEventDataEntryEpic,
    saveEditedEventEpic,
    saveEditedEventFailedEpic,
} from '../core_modules/capture-core/components/Pages/ViewEvent/EventDetailsSection/EditEventDataEntry/editEventDataEntry.epics';

import {
    loadViewEventDataEntryEpic,
} from '../core_modules/capture-core/components/Pages/ViewEvent/EventDetailsSection/ViewEventDataEntry/viewEventDataEntry.epics';
import {
    getEventOpeningFromEventListEpic,
    getEventFromUrlEpic as getViewEventFromUrlEpic,
    getOrgUnitOnUrlUpdateEpic as getViewEventOrgUnitOnUrlUpdateEpic,
    openViewPageLocationChangeEpic,
    backToMainPageEpic,
    backToMainPageLocationChangeEpic,
    openAddRelationshipForViewEventEpic,
} from '../core_modules/capture-core/components/Pages/ViewEvent/epics/viewEvent.epics';

import {
    saveEditEventEpic,
    saveEditEventLocationChangeEpic,
} from '../core_modules/capture-core/components/Pages/EditEvent/DataEntry/epics/saveEditSingleEvent.epics';
import {
    cancelEditEventEpic,
    cancelEditEventLocationChangeEpic,
} from '../core_modules/capture-core/components/Pages/EditEvent/DataEntry/epics/cancelEditSingleEvent.epics';
import {
    addNoteForEditSingleEventEpic,
    removeNoteForEditSingleEventEpic,
} from '../core_modules/capture-core/components/Pages/EditEvent/DataEntry/epics/addNoteForEditSingleEvent.epics';
import {
    goingOnlineEpic,
} from '../core_modules/capture-core/components/Connectivity/connectivity.epics';
import {
    networkMonitorStatusEpic,
} from '../core_modules/capture-core/components/NetworkStatusBadge/NetworkStatusBadge.epics';
import {
    setOrgUnit,
    setProgram,
    goBackToListContext,
} from '../core_modules/capture-core/components/LockedSelector/QuickSelector/epics/setSelection.epics';
import {
    searchRegisteringUnitListEpic,
    showRegisteringUnitListIndicatorEpic,
} from '../core_modules/capture-core/components/LockedSelector/QuickSelector';
import {
    resetProgramAfterSettingOrgUnitIfApplicableEpic,
} from '../core_modules/capture-core/components/Pages/epics/resetProgramAfterSettingOrgUnitIfApplicable.epic';
import {
    resetCategoriesAfterSettingOrgUnitIfApplicableEpic,
} from '../core_modules/capture-core/components/Pages/epics/resetCategoriesAfterSettingOrgUnitIfApplicable.epic';
import {
    calculateSelectionsCompletenessEpic,
} from '../core_modules/capture-core/components/Pages/epics/calculateSelectionsCompleteness.epic';
import {
    includeFiltersWithValueAfterColumnSortingEpic,
} from '../core_modules/capture-core/components/Pages/MainPage/WorkingListsCommon';
import {
    openRelationshipTeiSearchEpic,
    requestRelationshipTeiSearchEpic,
    TeiRelationshipNewOrEditSearchEpic,
} from '../core_modules/capture-core/components/Pages/NewRelationship/TeiRelationship/teiRelationship.epics';
import {
    teiSearchEpic,
    teiSearchSetProgramEpic,
    teiNewSearchEpic,
    teiSearchChangePageEpic,
} from '../core_modules/capture-core/components/TeiSearch/epics/teiSearch.epics';
import {
    getOrgUnitDataForNewEnrollmentUrlUpdateEpic,
    emptyOrgUnitForNewEnrollmentUrlUpdateEpic,
    validationForNewEnrollmentUrlUpdateEpic,
    openNewEnrollmentInDataEntryEpic,
    saveNewEnrollmentEpic,
} from '../core_modules/capture-core/components/Pages/NewEnrollment';
import {
    asyncUpdateFieldEpic,
} from '../core_modules/capture-core/components/D2Form';
import {
    filterFormFieldOrgUnitsEpic,
} from '../core_modules/capture-core/components/D2Form/field/Components/OrgUnitField/orgUnitFieldForForms.epics';

import {
    teiSearchFilterOrgUnitsEpic,
} from '../core_modules/capture-core/components/TeiSearch/SearchOrgUnitSelector/searchOrgUnitSelector.epics';

import {
    loadRelationshipsForViewEventEpic,
    addRelationshipForViewEventEpic,
    saveRelationshipFailedForViewEventEpic,
    relationshipSavedForViewEventEpic,
    deleteRelationshipForViewEventEpic,
    saveRelationshipAfterSavingTeiForViewEventEpic,
    handleViewEventRelationshipSaveTeiFailedEpic,
} from '../core_modules/capture-core/components/Pages/ViewEvent/Relationship/ViewEventRelationships.epics';

import {
    loadNotesForViewEventEpic,
    addNoteForViewEventEpic,
    saveNoteForViewEventFailedEpic,
} from '../core_modules/capture-core/components/Pages/ViewEvent/Notes/viewEventNotes.epics';

import {
    openNewRelationshipRegisterTeiEpic,
    loadSearchGroupDuplicatesForReviewEpic,
} from '../core_modules/capture-core/components/Pages/NewRelationship/RegisterTei';

import {
    runRulesOnEnrollmentFieldUpdateEpic,
    runRulesOnEnrollmentDataEntryFieldUpdateEpic,
} from '../core_modules/capture-core/components/DataEntries';
import { saveAssigneeEpic } from '../core_modules/capture-core/components/Pages/ViewEvent/RightColumn/AssigneeSection';

import { loadCoreEpic } from '../core_modules/capture-core/init';
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
    startNewEnrollmentDataEntrySelfInitialisationEpic,
} from '../core_modules/capture-core/components/DataEntries/EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.epics';
import {
    startNewTeiDataEntrySelfInitialisationEpic,
} from '../core_modules/capture-core/components/DataEntries/TeiRegistrationEntry/TeiRegistrationEntry.epics';
import {
    completeSavingNewTrackedEntityTypeEpic,
    startSavingNewTrackedEntityTypeEpic,
} from '../core_modules/capture-core/components/Pages/New/RegistrationDataEntry/RegistrationDataEntry.epics';
import { openNewRegistrationPageWithoutProgramIdEpic } from '../core_modules/capture-core/components/Pages/New/newPage.epics';

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
    startNewTeiDataEntrySelfInitialisationEpic,
    startNewEnrollmentDataEntrySelfInitialisationEpic,
    startSavingNewTrackedEntityTypeEpic,
    completeSavingNewTrackedEntityTypeEpic,
    openNewRegistrationPageWithoutProgramIdEpic,
    ...getDataEntryEpics(),
);
