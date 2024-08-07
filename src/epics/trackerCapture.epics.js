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
    saveNewEventStageEpic,
    saveNewEventStageFailedEpic,
    saveNewEventInStageLocationChangeEpic,
    addNoteForNewSingleEventEpic,
    openRelationshipForNewSingleEventEpic,
    addRelationshipForNewSingleEventEpic,
    saveNewEventRelationshipsIfExistsEpic,
    saveNewEventRelationshipFinishedEpic,
    teiForNewEventRelationshipSavedEpic,
} from 'capture-core/components/DataEntries/SingleEventRegistrationEntry';
import {
    navigateToEnrollmentOverviewEpic,
} from 'capture-core/actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.epics';
import {
    initEventListEpic,
    updateEventListEpic,
    retrieveTemplatesEpic,
    requestDeleteEventEpic,
    updateTemplateEpic,
    addTemplateEpic,
    deleteTemplateEpic,
} from 'capture-core/components/WorkingLists/EventWorkingLists';

import {
    fetchDataStoreEpic,
    fetchUserDataStoreEpic,
} from 'capture-core/components/DataStore/DataStore.epics';

import {
    getEventFromUrlEpic,
} from 'capture-core/components/Pages/ViewEvent/epics/editEvent.epics';
import {
    runRulesOnUpdateDataEntryFieldForEditSingleEventEpic,
    runRulesOnUpdateFieldForEditSingleEventEpic,
} from 'capture-core/components/WidgetEventEdit/DataEntry/epics/editEventDataEntry.epics';
import {
    loadEditEventDataEntryEpic,
    saveEditedEventEpic,
    saveEditedEventFailedEpic,
    saveEditedEventSucceededEpic,
    requestDeleteEventDataEntryEpic,
    startCreateNewAfterCompletingEpic,
    saveEventAndCompleteEnrollmentEpic as saveEditEventAndCompleteEnrollmentEpic,
} from 'capture-core/components/WidgetEventEdit/EditEventDataEntry/editEventDataEntry.epics';

import {
    loadViewEventDataEntryEpic,
} from 'capture-core/components/WidgetEventEdit/ViewEventDataEntry/viewEventDataEntry.epics';
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
    addNoteForEventEpic,
    removeNoteForEventEpic,
} from 'capture-core/components/WidgetEventNote/WidgetEventNote.epics';
import {
    goingOnlineEpic,
} from 'capture-core/components/Connectivity/connectivity.epics';
import {
    networkMonitorStatusEpic,
} from 'capture-core/components/NetworkStatusBadge/NetworkStatusBadge.epics';
import {
    resetProgramAfterSettingOrgUnitIfApplicableEpic,
} from 'capture-core/components/Pages/epics/resetProgramAfterSettingOrgUnitIfApplicable.epic';
import {
    calculateSelectionsCompletenessEpic,
} from 'capture-core/components/Pages/epics/calculateSelectionsCompleteness.epic';
import {
    includeFiltersWithValueAfterColumnSortingEpic,
} from 'capture-core/components/WorkingLists/WorkingListsCommon';
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
    searchTeiByTETIdEpic,
} from 'capture-core/components/TeiSearch/epics/teiSearch.epics';
import {
    teiSearchEpic as teiSearchEpicRelationshipsWidget,
    teiSearchSetProgramEpic as teiSearchSetProgramEpicRelationshipsWidget,
    teiNewSearchEpic as teiNewSearchEpicRelationshipsWidget,
    teiSearchChangePageEpic as teiSearchChangePageEpicRelationshipsWidget,
    searchTeiByTETIdEpic as searchTeiByTETIdEpicRelationshipsWidget,
} from 'capture-core/components/Pages/common/TEIRelationshipsWidget/TeiSearch/epics/teiSearch.epics';
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

import { addNoteForEnrollmentEpic } from 'capture-core/components/WidgetEnrollmentNote/WidgetEnrollmentNote.epics';
import {
    openNewRelationshipRegisterTeiEpic,
    loadSearchGroupDuplicatesForReviewEpic,
} from 'capture-core/components/Pages/NewRelationship/RegisterTei';

import {
    runRulesOnEnrollmentFieldUpdateEpic,
    runRulesOnEnrollmentDataEntryFieldUpdateEpic,
} from 'capture-core/components/DataEntries';

import { triggerLoadCoreEpic, loadAppEpic } from '../components/AppStart';

import {
    validateSelectionsBasedOnUrlUpdateEpic,
    getOrgUnitDataBasedOnUrlUpdateEpic,
    setOrgUnitDataEmptyBasedOnUrlUpdateEpic,
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
    navigateToNewTrackedEntityPageEpic,
} from '../core_modules/capture-core/components/SearchBox';
import {
    navigateBackToMainPageEpic,
} from '../core_modules/capture-core/components/Pages/Search/SearchPage.epics';
import { updateTeiEpic, updateTeiSucceededEpic, updateTeiFailedEpic } from '../core_modules/capture-core/components/WidgetProfile';
import {
    initTeiViewEpic,
    updateTeiListEpic,
    retrieveTEITemplatesEpic,
    updateTEITemplateEpic,
    addTEITemplateEpic,
    deleteTEITemplateEpic,
    retrieveAllTemplatesEpic,
    addProgramStageTemplateEpic,
    deleteProgramStageTemplateEpic,
    updateProgramStageTemplateEpic,
} from '../core_modules/capture-core/components/WorkingLists/TeiWorkingLists';
import {
    startNewEnrollmentDataEntrySelfInitialisationEpic,
} from '../core_modules/capture-core/components/DataEntries/EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.epics';
import {
    startNewTeiDataEntrySelfInitialisationEpic,
} from '../core_modules/capture-core/components/DataEntries/TeiRegistrationEntry/TeiRegistrationEntry.epics';
import {
    completeSavingNewTrackedEntityInstanceEpic,
    completeSavingNewTrackedEntityInstanceWithEnrollmentEpic, failedSavingNewTrackedEntityInstanceWithEnrollmentEpic,
    startSavingNewTrackedEntityInstanceEpic,
    startSavingNewTrackedEntityInstanceWithEnrollmentEpic,
} from '../core_modules/capture-core/components/Pages/New/RegistrationDataEntry/RegistrationDataEntry.epics';

import {
    changedEnrollmentIdEpic,
    fetchEnrollmentIdEpic,
    verifyEnrollmentIdSuccessEpic,
    enrollmentIdErrorEpic,
    changedTeiIdEpic,
    resetTeiIdEpic,
    fetchTeiIdEpic,
    verifyTeiFetchSuccessEpic,
    fetchTeiErrorEpic,
    changedProgramIdEpic,
    programIdErrorEpic,
    teiOrProgramChangeEpic,
    fetchEnrollmentsEpic,
    verifyFetchedEnrollmentsEpic,
    autoSwitchOrgUnitEpic,
    clearErrorViewEpic,
} from '../core_modules/capture-core/components/Pages/Enrollment/EnrollmentPage.epics';
import {
    saveNewEventSucceededEpic,
    saveNewEventFailedEpic,
} from '../core_modules/capture-core/components/Pages/EnrollmentAddEvent/EnrollmentAddEventPage.epics';
import {
    updateEventSucceededEpic,
    updateEventFailedEpic,
} from '../core_modules/capture-core/components/Pages/EnrollmentEditEvent';
import {
    runRulesOnUpdateDataEntryFieldForNewEnrollmentEventEpic,
    runRulesOnUpdateFieldForNewEnrollmentEventEpic,
    saveNewEnrollmentEventEpic,
    addNoteForNewEnrollmentEventEpic,
} from '../core_modules/capture-core/components/WidgetEnrollmentEventNew';
import {
    scheduleEnrollmentEventEpic,
} from '../core_modules/capture-core/components/WidgetEventSchedule';
import {
    orgUnitFetcherEpic,
} from '../core_modules/capture-core/components/OrgUnitFetcher';
import {
    getCoreOrgUnitEpic,
} from '../core_modules/capture-core/metadataRetrieval/coreOrgUnit';
import {
    openRelationshipTeiSearchWidgetEpic,
    openRelationshipTeiRegisterWidgetEpic,
} from '../core_modules/capture-core/components/Pages/common/TEIRelationshipsWidget/TrackedEntityRelationshipsWrapper';

export const epics = combineEpics(
    resetProgramAfterSettingOrgUnitIfApplicableEpic,
    calculateSelectionsCompletenessEpic,
    triggerLoadCoreEpic,
    fetchDataStoreEpic,
    fetchUserDataStoreEpic,
    loadAppEpic,
    initEventListEpic,
    initTeiViewEpic,
    updateTeiListEpic,
    openRelationshipTeiSearchWidgetEpic,
    openRelationshipTeiRegisterWidgetEpic,
    updateEventListEpic,
    retrieveTemplatesEpic,
    updateTemplateEpic,
    addTemplateEpic,
    deleteTemplateEpic,
    retrieveTEITemplatesEpic,
    updateTEITemplateEpic,
    addTEITemplateEpic,
    deleteTEITemplateEpic,
    retrieveAllTemplatesEpic,
    addProgramStageTemplateEpic,
    updateProgramStageTemplateEpic,
    deleteProgramStageTemplateEpic,
    requestDeleteEventEpic,
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
    runRulesOnUpdateDataEntryFieldForEditSingleEventEpic,
    runRulesOnUpdateFieldForEditSingleEventEpic,
    addNoteForEventEpic,
    addNoteForNewSingleEventEpic,
    removeNoteForEventEpic,
    getEventOpeningFromEventListEpic,
    networkMonitorStatusEpic,
    goingOnlineEpic,
    includeFiltersWithValueAfterColumnSortingEpic,
    saveNewEventAddAnotherEpic,
    saveNewEventAddAnotherFailedEpic,
    openRelationshipTeiSearchEpic,
    requestRelationshipTeiSearchEpic,
    TeiRelationshipNewOrEditSearchEpic,
    teiSearchEpic,
    teiSearchChangePageEpic,
    searchTeiByTETIdEpic,
    teiSearchEpicRelationshipsWidget,
    teiSearchSetProgramEpicRelationshipsWidget,
    teiNewSearchEpicRelationshipsWidget,
    teiSearchChangePageEpicRelationshipsWidget,
    searchTeiByTETIdEpicRelationshipsWidget,
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
    saveEditedEventSucceededEpic,
    openNewRelationshipRegisterTeiEpic,
    loadSearchGroupDuplicatesForReviewEpic,
    teiForNewEventRelationshipSavedEpic,
    validateSelectionsBasedOnUrlUpdateEpic,
    getOrgUnitDataBasedOnUrlUpdateEpic,
    setOrgUnitDataEmptyBasedOnUrlUpdateEpic,
    searchViaUniqueIdOnScopeProgramEpic,
    searchViaUniqueIdOnScopeTrackedEntityTypeEpic,
    searchViaAttributesOnScopeProgramEpic,
    searchViaAttributesOnScopeTrackedEntityTypeEpic,
    navigateBackToMainPageEpic,
    startFallbackSearchEpic,
    fallbackSearchEpic,
    fallbackPushPageEpic,
    setTrackedEntityTypeIdOnUrlEpic,
    startNewTeiDataEntrySelfInitialisationEpic,
    startNewEnrollmentDataEntrySelfInitialisationEpic,
    startSavingNewTrackedEntityInstanceEpic,
    startSavingNewTrackedEntityInstanceWithEnrollmentEpic,
    completeSavingNewTrackedEntityInstanceEpic,
    completeSavingNewTrackedEntityInstanceWithEnrollmentEpic,
    failedSavingNewTrackedEntityInstanceWithEnrollmentEpic,
    changedEnrollmentIdEpic,
    fetchEnrollmentIdEpic,
    verifyEnrollmentIdSuccessEpic,
    enrollmentIdErrorEpic,
    changedTeiIdEpic,
    resetTeiIdEpic,
    fetchTeiIdEpic,
    verifyTeiFetchSuccessEpic,
    fetchTeiErrorEpic,
    changedProgramIdEpic,
    programIdErrorEpic,
    teiOrProgramChangeEpic,
    fetchEnrollmentsEpic,
    verifyFetchedEnrollmentsEpic,
    autoSwitchOrgUnitEpic,
    clearErrorViewEpic,
    saveNewEventStageEpic,
    saveNewEventStageFailedEpic,
    saveNewEventInStageLocationChangeEpic,
    runRulesOnUpdateDataEntryFieldForNewEnrollmentEventEpic,
    runRulesOnUpdateFieldForNewEnrollmentEventEpic,
    saveNewEnrollmentEventEpic,
    saveNewEventSucceededEpic,
    saveNewEventFailedEpic,
    updateEventSucceededEpic,
    updateEventFailedEpic,
    addNoteForNewEnrollmentEventEpic,
    addNoteForEnrollmentEpic,
    navigateToEnrollmentOverviewEpic,
    scheduleEnrollmentEventEpic,
    orgUnitFetcherEpic,
    getCoreOrgUnitEpic,
    updateTeiEpic,
    updateTeiSucceededEpic,
    updateTeiFailedEpic,
    navigateToNewTrackedEntityPageEpic,
    requestDeleteEventDataEntryEpic,
    startCreateNewAfterCompletingEpic,
    saveEditEventAndCompleteEnrollmentEpic,
);
