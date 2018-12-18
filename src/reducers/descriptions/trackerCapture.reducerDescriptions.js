// @flow
import { formsValuesDesc, formsSectionsFieldsUIDesc } from 'capture-core/reducers/descriptions/form.reducerDescription';
import { eventsDesc, eventsValuesDesc } from 'capture-core/reducers/descriptions/events.reducerDescription';
import {
    dataEntriesDesc,
    dataEntriesUIDesc,
    dataEntriesFieldsValueDesc,
    dataEntriesNotesDesc,
    dataEntriesRelationshipsDesc,
    dataEntriesFieldsMetaDesc,
    dataEntriesFieldsUIDesc,
} from 'capture-core/reducers/descriptions/dataEntry.reducerDescription';
import { feedbackDesc } from 'capture-core/reducers/descriptions/feedback.reducerDescription';
import {
    rulesEffectsHiddenFieldsDesc,
    rulesEffectsErrorMessagesDesc,
    rulesEffectsHiddenSectionsDesc,
    rulesEffectsCompulsoryFieldsDesc,
    rulesEffectsFeedbackDesc,
    rulesEffectsIndicatorsDesc,
    rulesEffectsGeneralWarningsDesc,
    rulesEffectsGeneralErrorsDesc,
} from 'capture-core/reducers/descriptions/rulesEffects.reducerDescription';
import {
    workingListsDesc,
    workingListsMetaDesc,
    workingListsUIDesc,
    workingListsColumnsOrderDesc,
    workingListsContextDesc,
    workingListFiltersEditDesc,
    workingListsAppliedFiltersDesc,
    workingListsUserSelectedFiltersDesc,
} from 'capture-core/reducers/descriptions/workingLists.reducerDescription';
import { mainPageDesc } from 'capture-core/reducers/descriptions/mainPage.reducerDescription';
import { newEventPageDesc } from 'capture-core/reducers/descriptions/newEvent.reducerDescription';
import { editEventPageDesc } from 'capture-core/reducers/descriptions/editEvent.reducerDescription';
import { newEnrollmentPageDesc } from 'capture-core/reducers/descriptions/newEnrollment.reducerDescription';
import { newRelationshipDesc } from 'capture-core/reducers/descriptions/newRelationship.reducerDescription';
import {
    organisationUnitDesc,
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

import { appReducerDesc } from './app.reducerDescription';
import { currentSelectionsReducerDesc } from './currentSelections.reducerDescription';

export default [
    appReducerDesc,
    currentSelectionsReducerDesc,
    formsValuesDesc,
    formsSectionsFieldsUIDesc,
    eventsDesc,
    eventsValuesDesc,
    dataEntriesDesc,
    dataEntriesUIDesc,
    dataEntriesFieldsValueDesc,
    dataEntriesNotesDesc,
    dataEntriesRelationshipsDesc,
    dataEntriesFieldsMetaDesc,
    dataEntriesFieldsUIDesc,
    feedbackDesc,
    rulesEffectsHiddenFieldsDesc,
    rulesEffectsErrorMessagesDesc,
    rulesEffectsHiddenSectionsDesc,
    rulesEffectsCompulsoryFieldsDesc,
    rulesEffectsFeedbackDesc,
    rulesEffectsIndicatorsDesc,
    rulesEffectsGeneralWarningsDesc,
    rulesEffectsGeneralErrorsDesc,
    workingListsDesc,
    workingListsMetaDesc,
    workingListsUIDesc,
    workingListsColumnsOrderDesc,
    workingListsContextDesc,
    workingListFiltersEditDesc,
    workingListsAppliedFiltersDesc,
    workingListsUserSelectedFiltersDesc,
    mainPageDesc,
    newEventPageDesc,
    editEventPageDesc,
    newEnrollmentPageDesc,
    newRelationshipDesc,
    organisationUnitDesc,
    registeringUnitListDesc,
    networkStatusDesc,
    recentlyAddedEventsDesc,
    recentlyAddedEventsValuesDesc,
    teiSearchDesc,
];
