import {
    formsValuesDesc,
    formsSectionsFieldsUIDesc,
    formsDesc,
    formsFieldsMiscDesc,
} from '../../core_modules/capture-core/reducers/descriptions/form.reducerDescription';
import { eventsDesc, eventsValuesDesc } from '../../core_modules/capture-core/reducers/descriptions/events.reducerDescription';
import {
    dataEntriesDesc,
    dataEntriesUIDesc,
    dataEntriesFieldsValueDesc,
    dataEntriesNotesDesc,
    dataEntriesRelationshipsDesc,
    dataEntriesFieldsMetaDesc,
    dataEntriesFieldsUIDesc,
    dataEntriesInProgressListDesc,
} from '../../core_modules/capture-core/reducers/descriptions/dataEntry.reducerDescription';
import {
    rulesEffectsHiddenFieldsDesc,
    rulesEffectsErrorMessagesDesc,
    rulesEffectsHiddenSectionsDesc,
    rulesEffectsHiddenProgramStageDesc,
    rulesEffectsCompulsoryFieldsDesc,
    rulesEffectsFeedbackDesc,
    rulesEffectsIndicatorsDesc,
    rulesEffectsGeneralWarningsDesc,
    rulesEffectsGeneralErrorsDesc,
    rulesEffectsDisabledFieldsDesc,
    ruleEffectsOptionsVisibilityDesc,
} from '../../core_modules/capture-core/reducers/descriptions/rulesEffects.reducerDescription';
import {
    workingListsDesc,
    workingListsMetaDesc,
    workingListsUIDesc,
    workingListsColumnsOrderDesc,
    workingListsContextDesc,
    workingListsStickyFiltersDesc,
    workingListsTemplatesDesc,
    workingListsListRecordsDesc,
} from '../../core_modules/capture-core/reducers/descriptions/workingLists';
import { mainPageDesc } from '../../core_modules/capture-core/reducers/descriptions/mainPage.reducerDescription';
import { newEventPageDesc } from '../../core_modules/capture-core/reducers/descriptions/newEvent.reducerDescription';
import { editEventPageDesc } from '../../core_modules/capture-core/reducers/descriptions/editEvent.reducerDescription';
import { viewEventPageDesc } from '../../core_modules/capture-core/reducers/descriptions/viewEvent.reducerDescription';
import {
    newRelationshipDesc,
    newRelationshipRegisterTeiDesc,
} from '../../core_modules/capture-core/reducers/descriptions/newRelationship.reducerDescription';
import {
    organisationUnitDesc,
    organisationUnitRootsDesc,
} from '../../core_modules/capture-core/reducers/descriptions/organisationUnits.reducerDescription';
import { networkStatusDesc } from '../../core_modules/capture-core/reducers/descriptions/networkStatus.reducerDescription';
import {
    recentlyAddedEventsDesc,
    recentlyAddedEventsValuesDesc,
} from '../../core_modules/capture-core/reducers/descriptions/recentlyAddedEvents.reducerDescription';
import {
    teiSearchDesc,
} from '../../core_modules/capture-core/reducers/descriptions/teiSearch.reducerDescription';

import { notesDesc } from '../../core_modules/capture-core/reducers/descriptions/notes.reducerDescription';
import { relationshipsDesc } from '../../core_modules/capture-core/reducers/descriptions/relationships.reducerDescription';
import {
    generatedUniqueValuesCacheDesc,
} from '../../core_modules/capture-core/reducers/descriptions/generatedUniqueValuesCache.reducerDescription';

import { appReducerDesc } from './app.reducerDescription';
import { currentSelectionsReducerDesc } from './currentSelections.reducerDescription';
import { feedbackDesc } from './feedback.reducerDescription';
import { activePageDesc } from '../../core_modules/capture-core/reducers/descriptions/activePage.reducerDescription';
import { searchDomainDesc } from '../../core_modules/capture-core/reducers/descriptions/searchDomain.reducerDescription';
import { enrollmentPageDesc } from '../../core_modules/capture-core/reducers/descriptions/enrollmentPage.reducerDescription';
import { enrollmentDomainDesc } from '../../core_modules/capture-core/reducers/descriptions/enrollmentDomain.reducerDescription';
import { breakTheGlassAccessDesc } from '../../core_modules/capture-core/reducers/descriptions/breakTheGlass.reducerDescription';
import { newPageDesc } from '../../core_modules/capture-core/reducers/descriptions/newPage.reducerDescription';
import { possibleDuplicatesDesc } from '../../core_modules/capture-core/reducers/descriptions/possibleDuplicates.reducerDescription';
import { trackedEntityInstanceDesc } from '../../core_modules/capture-core/reducers/descriptions/trackedEntityInstance.reducerDescription';
import { widgetEnrollmentDesc } from '../../core_modules/capture-core/reducers/descriptions/widgetEnrollment.reducerDescription';

export const reducerDescriptions = [
    activePageDesc,
    appReducerDesc,
    currentSelectionsReducerDesc,
    editEventPageDesc,
    enrollmentPageDesc,
    enrollmentDomainDesc,
    breakTheGlassAccessDesc,
    eventsDesc,
    eventsValuesDesc,
    dataEntriesDesc,
    dataEntriesUIDesc,
    dataEntriesFieldsValueDesc,
    dataEntriesNotesDesc,
    dataEntriesRelationshipsDesc,
    dataEntriesFieldsMetaDesc,
    dataEntriesFieldsUIDesc,
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
    recentlyAddedEventsDesc,
    recentlyAddedEventsValuesDesc,
    relationshipsDesc,
    rulesEffectsHiddenFieldsDesc,
    rulesEffectsErrorMessagesDesc,
    rulesEffectsHiddenSectionsDesc,
    rulesEffectsHiddenProgramStageDesc,
    rulesEffectsCompulsoryFieldsDesc,
    rulesEffectsFeedbackDesc,
    rulesEffectsIndicatorsDesc,
    rulesEffectsGeneralWarningsDesc,
    rulesEffectsGeneralErrorsDesc,
    rulesEffectsDisabledFieldsDesc,
    ruleEffectsOptionsVisibilityDesc,
    searchDomainDesc,
    teiSearchDesc,
    trackedEntityInstanceDesc,
    viewEventPageDesc,
    workingListsDesc,
    workingListsMetaDesc,
    workingListsUIDesc,
    workingListsColumnsOrderDesc,
    workingListsContextDesc,
    workingListsStickyFiltersDesc,
    workingListsListRecordsDesc,
    workingListsTemplatesDesc,
    widgetEnrollmentDesc,
];
