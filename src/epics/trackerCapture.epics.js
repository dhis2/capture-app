// @flow
import {
    navigateToEnrollmentOverviewEpic,
} from 'capture-core/actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.epics';


import {
    goingOnlineEpic,
} from 'capture-core/components/Connectivity/connectivity.epics';
import {
    asyncUpdateFieldEpic,
} from 'capture-core/components/D2Form';
import {
    filterFormFieldOrgUnitsEpic,
} from 'capture-core/components/D2Form/field/Components/OrgUnitField/orgUnitFieldForForms.epics';


import {
    runRulesOnEnrollmentFieldUpdateEpic,
    runRulesOnEnrollmentDataEntryFieldUpdateEpic,
} from 'capture-core/components/DataEntries';
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


import { checkForDuplicateEpic } from 'capture-core/components/DataEntryUtils';
import {
    fetchDataStoreEpic,
    fetchUserDataStoreEpic,
} from 'capture-core/components/DataStore/DataStore.epics';
import {
    searchRegisteringUnitListEpic,
    showRegisteringUnitListIndicatorEpic,
} from 'capture-core/components/LockedSelector/QuickSelector';
import {
    networkMonitorStatusEpic,
} from 'capture-core/components/NetworkStatusBadge/NetworkStatusBadge.epics';
import {
    calculateSelectionsCompletenessEpic,
} from 'capture-core/components/Pages/epics/calculateSelectionsCompleteness.epic';
import {
    resetCategoriesAfterSettingOrgUnitIfApplicableEpic,
} from 'capture-core/components/Pages/epics/resetCategoriesAfterSettingOrgUnitIfApplicable.epic';
import {
    resetProgramAfterSettingOrgUnitIfApplicableEpic,
} from 'capture-core/components/Pages/epics/resetProgramAfterSettingOrgUnitIfApplicable.epic';
import {
    openNewRelationshipRegisterTeiEpic,
    loadSearchGroupDuplicatesForReviewEpic,
} from 'capture-core/components/Pages/NewRelationship/RegisterTei';
import {
    openRelationshipTeiSearchEpic,
    requestRelationshipTeiSearchEpic,
    TeiRelationshipNewOrEditSearchEpic,
} from 'capture-core/components/Pages/NewRelationship/TeiRelationship/teiRelationship.epics';
import {
    getEventFromUrlEpic,
    getOrgUnitOnUrlUpdateEpic,
} from 'capture-core/components/Pages/ViewEvent/epics/editEvent.epics';
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
    loadNotesForViewEventEpic,
    addNoteForViewEventEpic,
    saveNoteForViewEventFailedEpic,
} from 'capture-core/components/Pages/ViewEvent/Notes/viewEventNotes.epics';
import {
    loadRelationshipsForViewEventEpic,
    addRelationshipForViewEventEpic,
    saveRelationshipFailedForViewEventEpic,
    relationshipSavedForViewEventEpic,
    deleteRelationshipForViewEventEpic,
    saveRelationshipAfterSavingTeiForViewEventEpic,
    handleViewEventRelationshipSaveTeiFailedEpic,
} from 'capture-core/components/Pages/ViewEvent/Relationship/ViewEventRelationships.epics';
import { saveAssigneeEpic } from 'capture-core/components/Pages/ViewEvent/RightColumn/AssigneeSection';
import {
    teiSearchEpic,
    teiSearchSetProgramEpic,
    teiNewSearchEpic,
    teiSearchChangePageEpic,
} from 'capture-core/components/TeiSearch/epics/teiSearch.epics';
import {
    teiSearchFilterOrgUnitsEpic,
} from 'capture-core/components/TeiSearch/SearchOrgUnitSelector/searchOrgUnitSelector.epics';
import { addNoteForEnrollmentEpic } from 'capture-core/components/WidgetEnrollmentComment/WidgetEnrollmentComment.epics';
import {
    addNoteForEventEpic,
    removeNoteForEventEpic,
} from 'capture-core/components/WidgetEventComment/WidgetEventComment.epics';
import {
    cancelEditEventEpic,
    cancelEditEventLocationChangeEpic,
} from 'capture-core/components/WidgetEventEdit/DataEntry/epics/cancelEditSingleEvent.epics';
import {
    openEditEventInDataEntryEpic,
    runRulesOnUpdateDataEntryFieldForEditSingleEventEpic,
    runRulesOnUpdateFieldForEditSingleEventEpic,
} from 'capture-core/components/WidgetEventEdit/DataEntry/epics/editEventDataEntry.epics';
import {
    saveEditEventEpic,
    saveEditEventLocationChangeEpic,
} from 'capture-core/components/WidgetEventEdit/DataEntry/epics/saveEditSingleEvent.epics';
import {
    loadEditEventDataEntryEpic,
    saveEditedEventEpic,
    saveEditedEventFailedEpic,
    saveEditedEventSucceededEpic,
} from 'capture-core/components/WidgetEventEdit/EditEventDataEntry/editEventDataEntry.epics';
import {
    loadViewEventDataEntryEpic,
} from 'capture-core/components/WidgetEventEdit/ViewEventDataEntry/viewEventDataEntry.epics';
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
    includeFiltersWithValueAfterColumnSortingEpic,
} from 'capture-core/components/WorkingLists/WorkingListsCommon';
import { loadCoreEpic } from 'capture-core/init';
import { combineEpics } from 'redux-observable';

import { triggerLoadCoreEpic, loadAppEpic, loadCoreFailedEpic } from '../components/AppStart';


import {
    startNewEnrollmentDataEntrySelfInitialisationEpic,
} from '../core_modules/capture-core/components/DataEntries/EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.epics';
import {
    startNewTeiDataEntrySelfInitialisationEpic,
} from '../core_modules/capture-core/components/DataEntries/TeiRegistrationEntry/TeiRegistrationEntry.epics';
import {
    validateSelectionsBasedOnUrlUpdateEpic,
    getOrgUnitDataBasedOnUrlUpdateEpic,
    setOrgUnitDataEmptyBasedOnUrlUpdateEpic,
    startAgainEpic,
    setOrgUnitIdEpic,
    setProgramIdEpic,
    resetOrgUnitId,
    resetProgramIdEpic,
    fetchOrgUnitEpic,
    resetTeiSelectionEpic,
    setEnrollmentSelectionEpic,
    resetEnrollmentSelectionEpic,
} from '../core_modules/capture-core/components/LockedSelector';

import {
    fetchEnrollmentPageInformationFromUrlEpic,
    startFetchingTeiFromEnrollmentIdEpic,
    startFetchingTeiFromTeiIdEpic,
    openEnrollmentPageEpic,
} from '../core_modules/capture-core/components/Pages/Enrollment/EnrollmentPage.epics';
import {
    saveNewEventSucceededEpic,
    saveNewEventFailedEpic,
} from '../core_modules/capture-core/components/Pages/EnrollmentAddEvent/EnrollmentAddEventPage.epics';
import { openNewRegistrationPageFromLockedSelectorEpic } from '../core_modules/capture-core/components/Pages/New/newPage.epics';
import {
    completeSavingNewTrackedEntityInstanceEpic,
    completeSavingNewTrackedEntityInstanceWithEnrollmentEpic,
    startSavingNewTrackedEntityInstanceEpic,
    startSavingNewTrackedEntityInstanceWithEnrollmentEpic,
} from '../core_modules/capture-core/components/Pages/New/RegistrationDataEntry/RegistrationDataEntry.epics';
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
    setTrackedEntityTypeIdOnUrlEpic,
} from '../core_modules/capture-core/components/TrackedEntityTypeSelector/TrackedEntityTypeSelector.epics';
import {
    runRulesOnUpdateDataEntryFieldForNewEnrollmentEventEpic,
    runRulesOnUpdateFieldForNewEnrollmentEventEpic,
    saveNewEnrollmentEventEpic,
    addNoteForNewEnrollmentEventEpic,
} from '../core_modules/capture-core/components/WidgetEnrollmentEventNew';
import {
    scheduleNewEnrollmentEventEpic,
} from '../core_modules/capture-core/components/WidgetEventSchedule';
import { initTeiViewEpic, updateTeiListEpic } from '../core_modules/capture-core/components/WorkingLists/TeiWorkingLists';

export const epics = combineEpics(
    resetProgramAfterSettingOrgUnitIfApplicableEpic,
    resetCategoriesAfterSettingOrgUnitIfApplicableEpic,
    calculateSelectionsCompletenessEpic,
    triggerLoadCoreEpic,
    loadCoreEpic,
    fetchDataStoreEpic,
    fetchUserDataStoreEpic,
    loadAppEpic,
    loadCoreFailedEpic,
    initEventListEpic,
    initTeiViewEpic,
    updateTeiListEpic,
    updateEventListEpic,
    retrieveTemplatesEpic,
    updateTemplateEpic,
    addTemplateEpic,
    deleteTemplateEpic,
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
    getOrgUnitOnUrlUpdateEpic,
    openEditEventInDataEntryEpic,
    runRulesOnUpdateDataEntryFieldForEditSingleEventEpic,
    runRulesOnUpdateFieldForEditSingleEventEpic,
    saveEditEventLocationChangeEpic,
    saveEditEventEpic,
    cancelEditEventLocationChangeEpic,
    cancelEditEventEpic,
    addNoteForEventEpic,
    addNoteForNewSingleEventEpic,
    removeNoteForEventEpic,
    getEventOpeningFromEventListEpic,
    networkMonitorStatusEpic,
    goingOnlineEpic,
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
    saveEditedEventSucceededEpic,
    openNewRelationshipRegisterTeiEpic,
    loadSearchGroupDuplicatesForReviewEpic,
    teiForNewEventRelationshipSavedEpic,
    saveAssigneeEpic,
    setOrgUnitIdEpic,
    setProgramIdEpic,
    resetOrgUnitId,
    resetProgramIdEpic,
    fetchOrgUnitEpic,
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
    startSavingNewTrackedEntityInstanceEpic,
    startSavingNewTrackedEntityInstanceWithEnrollmentEpic,
    completeSavingNewTrackedEntityInstanceEpic,
    completeSavingNewTrackedEntityInstanceWithEnrollmentEpic,
    openNewRegistrationPageFromLockedSelectorEpic,
    fetchEnrollmentPageInformationFromUrlEpic,
    startFetchingTeiFromEnrollmentIdEpic,
    startFetchingTeiFromTeiIdEpic,
    resetTeiSelectionEpic,
    setEnrollmentSelectionEpic,
    resetEnrollmentSelectionEpic,
    openEnrollmentPageEpic,
    checkForDuplicateEpic,
    saveNewEventStageEpic,
    saveNewEventStageFailedEpic,
    saveNewEventInStageLocationChangeEpic,
    runRulesOnUpdateDataEntryFieldForNewEnrollmentEventEpic,
    runRulesOnUpdateFieldForNewEnrollmentEventEpic,
    saveNewEnrollmentEventEpic,
    saveNewEventSucceededEpic,
    saveNewEventFailedEpic,
    addNoteForNewEnrollmentEventEpic,
    addNoteForEnrollmentEpic,
    navigateToEnrollmentOverviewEpic,
    scheduleNewEnrollmentEventEpic,
);
