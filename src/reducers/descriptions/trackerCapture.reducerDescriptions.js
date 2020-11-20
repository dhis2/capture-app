// @flow
import {
    formsValuesDesc,
    formsSectionsFieldsUIDesc,
    formsDesc,
    formsFieldsMiscDesc,
} from 'capture-core/reducers/descriptions/form.reducerDescription';
import { eventsDesc, eventsValuesDesc } from 'capture-core/reducers/descriptions/events.reducerDescription';
import {
    dataEntriesDesc,
    dataEntriesUIDesc,
    dataEntriesFieldsValueDesc,
    dataEntriesNotesDesc,
    dataEntriesRelationshipsDesc,
    dataEntriesFieldsMetaDesc,
    dataEntriesFieldsUIDesc,
    dataEntriesSearchGroupsResultsDesc,
    dataEntriesSearchGroupsPreviousValuesDesc,
    dataEntriesInProgressListDesc,
} from 'capture-core/reducers/descriptions/dataEntry.reducerDescription';
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
import { mainPageDesc } from 'capture-core/reducers/descriptions/mainPage.reducerDescription';
import { newEventPageDesc } from 'capture-core/reducers/descriptions/newEvent.reducerDescription';
import { editEventPageDesc } from 'capture-core/reducers/descriptions/editEvent.reducerDescription';
import { viewEventPageDesc } from 'capture-core/reducers/descriptions/viewEvent.reducerDescription';
import { newEnrollmentPageDesc } from 'capture-core/reducers/descriptions/newEnrollment.reducerDescription';
import {
    newRelationshipDesc,
    newRelationshipRegisterTeiDesc,
    newRelationshipRegisterTeiDuplicatesReviewDesc,
} from 'capture-core/reducers/descriptions/newRelationship.reducerDescription';
import {
    organisationUnitDesc,
    organisationUnitRootsDesc,
    registeringUnitListDesc,
} from 'capture-core/reducers/descriptions/organisationUnits.reducerDescription';
import { networkStatusDesc } from 'capture-core/reducers/descriptions/networkStatus.reducerDescription';
import {
    recentlyAddedEventsDesc,
    recentlyAddedEventsValuesDesc,
} from 'capture-core/reducers/descriptions/recentlyAddedEvents.reducerDescription';
import {
    teiSearchDesc,
} from 'capture-core/reducers/descriptions/teiSearch.reducerDescription';

import { notesDesc } from 'capture-core/reducers/descriptions/notes.reducerDescription';
import { relationshipsDesc } from 'capture-core/reducers/descriptions/relationships.reducerDescription';
import {
    generatedUniqueValuesCacheDesc,
} from 'capture-core/reducers/descriptions/generatedUniqueValuesCache.reducerDescription';

import { appReducerDesc } from './app.reducerDescription';
import { currentSelectionsReducerDesc } from './currentSelections.reducerDescription';
import { feedbackDesc } from './feedback.reducerDescription';
import { activePageDesc } from '../../core_modules/capture-core/reducers/descriptions/activePage.reducerDescription';
import { searchPageDesc } from '../../core_modules/capture-core/reducers/descriptions/searchPage.reducerDescription';
import { newPageDesc } from '../../core_modules/capture-core/reducers/descriptions/newPage.reducerDescription';

export default [
    activePageDesc,
    appReducerDesc,
    currentSelectionsReducerDesc,
    formsValuesDesc,
    formsSectionsFieldsUIDesc,
    formsDesc,
    formsFieldsMiscDesc,
    eventsDesc,
    eventsValuesDesc,
    dataEntriesDesc,
    dataEntriesUIDesc,
    dataEntriesFieldsValueDesc,
    dataEntriesNotesDesc,
    dataEntriesRelationshipsDesc,
    dataEntriesFieldsMetaDesc,
    dataEntriesFieldsUIDesc,
    dataEntriesSearchGroupsResultsDesc,
    dataEntriesSearchGroupsPreviousValuesDesc,
    dataEntriesInProgressListDesc,
    feedbackDesc,
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
    workingListsDesc,
    workingListsMetaDesc,
    workingListsUIDesc,
    workingListsColumnsOrderDesc,
    workingListsContextDesc,
    workingListsStickyFiltersDesc,
    workingListsListRecordsDesc,
    workingListsTemplatesDesc,
    mainPageDesc,
    newEventPageDesc,
    editEventPageDesc,
    viewEventPageDesc,
    newPageDesc,
    newEnrollmentPageDesc,
    newRelationshipDesc,
    newRelationshipRegisterTeiDesc,
    newRelationshipRegisterTeiDuplicatesReviewDesc,
    organisationUnitDesc,
    organisationUnitRootsDesc,
    registeringUnitListDesc,
    searchPageDesc,
    networkStatusDesc,
    recentlyAddedEventsDesc,
    recentlyAddedEventsValuesDesc,
    teiSearchDesc,
    notesDesc,
    relationshipsDesc,
    generatedUniqueValuesCacheDesc,
];
