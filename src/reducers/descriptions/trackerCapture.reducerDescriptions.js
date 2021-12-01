// @flow
import {
    workingListsDesc,
    workingListsMetaDesc,
    workingListsUIDesc,
    workingListsColumnsOrderDesc,
    workingListsContextDesc,
    workingListsStickyFiltersDesc,
    workingListsTemplatesDesc,
    workingListsListRecordsDesc,
} from 'capture-core/reducers/descriptions/workingLists';
import { viewEventPageDesc } from 'capture-core/reducers/descriptions/viewEvent.reducerDescription';
import {
    teiSearchDesc,
} from 'capture-core/reducers/descriptions/teiSearch.reducerDescription';
import {
    rulesEffectsHiddenFieldsDesc,
    rulesEffectsErrorMessagesDesc,
    rulesEffectsHiddenSectionsDesc,
    rulesEffectsCompulsoryFieldsDesc,
    rulesEffectsFeedbackDesc,
    rulesEffectsIndicatorsDesc,
    rulesEffectsGeneralWarningsDesc,
    rulesEffectsGeneralErrorsDesc,
    rulesEffectsDisabledFieldsDesc,
    ruleEffectsOptionsVisibilityDesc,
} from 'capture-core/reducers/descriptions/rulesEffects.reducerDescription';
import { relationshipsDesc } from 'capture-core/reducers/descriptions/relationships.reducerDescription';
import {
    recentlyAddedEventsDesc,
    recentlyAddedEventsValuesDesc,
} from 'capture-core/reducers/descriptions/recentlyAddedEvents.reducerDescription';
import {
    organisationUnitDesc,
    organisationUnitRootsDesc,
    registeringUnitListDesc,
} from 'capture-core/reducers/descriptions/organisationUnits.reducerDescription';
import { notesDesc } from 'capture-core/reducers/descriptions/notes.reducerDescription';
import {
    newRelationshipDesc,
    newRelationshipRegisterTeiDesc,
} from 'capture-core/reducers/descriptions/newRelationship.reducerDescription';
import { newEventPageDesc } from 'capture-core/reducers/descriptions/newEvent.reducerDescription';
import { networkStatusDesc } from 'capture-core/reducers/descriptions/networkStatus.reducerDescription';
import { mainPageDesc } from 'capture-core/reducers/descriptions/mainPage.reducerDescription';
import {
    generatedUniqueValuesCacheDesc,
} from 'capture-core/reducers/descriptions/generatedUniqueValuesCache.reducerDescription';
import {
    formsValuesDesc,
    formsSectionsFieldsUIDesc,
    formsDesc,
    formsFieldsMiscDesc,
} from 'capture-core/reducers/descriptions/form.reducerDescription';
import { eventsDesc, eventsValuesDesc } from 'capture-core/reducers/descriptions/events.reducerDescription';
import { editEventPageDesc } from 'capture-core/reducers/descriptions/editEvent.reducerDescription';
import {
    dataStoreDesc,
} from 'capture-core/reducers/descriptions/dataStore.reducerDescription';
import {
    dataEntriesDesc,
    dataEntriesUIDesc,
    dataEntriesFieldsValueDesc,
    dataEntriesNotesDesc,
    dataEntriesRelationshipsDesc,
    dataEntriesFieldsMetaDesc,
    dataEntriesFieldsUIDesc,
    dataEntriesInProgressListDesc,
} from 'capture-core/reducers/descriptions/dataEntry.reducerDescription';
import { dataEntriesSearchGroupResultsReducerDesc } from 'capture-core/components/DataEntryUtils';


import { searchPageDesc } from '../../core_modules/capture-core/reducers/descriptions/searchPage.reducerDescription';
import { possibleDuplicatesDesc } from '../../core_modules/capture-core/reducers/descriptions/possibleDuplicates.reducerDescription';
import { newPageDesc } from '../../core_modules/capture-core/reducers/descriptions/newPage.reducerDescription';
import { enrollmentPageDesc } from '../../core_modules/capture-core/reducers/descriptions/enrollmentPage.reducerDescription';
import { enrollmentDomainDesc } from '../../core_modules/capture-core/reducers/descriptions/enrollmentDomain.reducerDescription';
import { activePageDesc } from '../../core_modules/capture-core/reducers/descriptions/activePage.reducerDescription';
import { feedbackDesc } from './feedback.reducerDescription';
import { currentSelectionsReducerDesc } from './currentSelections.reducerDescription';
import { appReducerDesc } from './app.reducerDescription';

export const reducerDescriptions = [
    activePageDesc,
    appReducerDesc,
    currentSelectionsReducerDesc,
    editEventPageDesc,
    enrollmentPageDesc,
    enrollmentDomainDesc,
    eventsDesc,
    eventsValuesDesc,
    dataEntriesDesc,
    dataEntriesUIDesc,
    dataEntriesFieldsValueDesc,
    dataEntriesNotesDesc,
    dataEntriesRelationshipsDesc,
    dataEntriesFieldsMetaDesc,
    dataEntriesFieldsUIDesc,
    dataEntriesSearchGroupResultsReducerDesc,
    dataEntriesInProgressListDesc,
    feedbackDesc,
    formsValuesDesc,
    formsSectionsFieldsUIDesc,
    formsDesc,
    formsFieldsMiscDesc,
    generatedUniqueValuesCacheDesc,
    mainPageDesc,
    networkStatusDesc,
    newEventPageDesc,
    newPageDesc,
    newRelationshipDesc,
    newRelationshipRegisterTeiDesc,
    notesDesc,
    organisationUnitDesc,
    organisationUnitRootsDesc,
    possibleDuplicatesDesc,
    registeringUnitListDesc,
    recentlyAddedEventsDesc,
    recentlyAddedEventsValuesDesc,
    relationshipsDesc,
    rulesEffectsHiddenFieldsDesc,
    rulesEffectsErrorMessagesDesc,
    rulesEffectsHiddenSectionsDesc,
    rulesEffectsCompulsoryFieldsDesc,
    rulesEffectsFeedbackDesc,
    rulesEffectsIndicatorsDesc,
    rulesEffectsGeneralWarningsDesc,
    rulesEffectsGeneralErrorsDesc,
    rulesEffectsDisabledFieldsDesc,
    ruleEffectsOptionsVisibilityDesc,
    searchPageDesc,
    teiSearchDesc,
    dataStoreDesc,
    viewEventPageDesc,
    workingListsDesc,
    workingListsMetaDesc,
    workingListsUIDesc,
    workingListsColumnsOrderDesc,
    workingListsContextDesc,
    workingListsStickyFiltersDesc,
    workingListsListRecordsDesc,
    workingListsTemplatesDesc,
];
