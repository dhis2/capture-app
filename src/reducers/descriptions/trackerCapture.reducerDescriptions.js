// @flow
import { formsValuesDesc, formsSectionsFieldsUIDesc } from 'capture-core/reducers/descriptions/form.reducerDescription';
import { eventsDesc, eventsValuesDesc } from 'capture-core/reducers/descriptions/events.reducerDescription';
import {
    dataEntriesDesc,
    dataEntriesUIDesc,
    dataEntriesFieldsValueDesc,
    dataEntriesFieldsMetaDesc,
    dataEntriesFieldsUIDesc,
} from 'capture-core/reducers/descriptions/dataEntry.reducerDescription';
import { feedbackDesc } from 'capture-core/reducers/descriptions/feedback.reducerDescription';
import {
    rulesEffectsHiddenFieldsDesc,
    rulesEffectsErrorMessagesDesc,
    rulesEffectsHiddenSectionsDesc,
    rulesEffectsCompulsoryFieldsDesc,
} from 'capture-core/reducers/descriptions/rulesEffects.reducerDescription';
import {
    workingListsDesc,
    workingListsMetaDesc,
    workingListsUIDesc,
    workingListsColumnsOrderDesc,
    workingListsContextDesc,
    workingListFiltersEditDesc,
    workingListsAppliedFiltersDesc,
} from 'capture-core/reducers/descriptions/workingLists.reducerDescription';
import { mainPageDesc } from 'capture-core/reducers/descriptions/mainPage.reducerDescription';
import { newEventPageDesc } from 'capture-core/reducers/descriptions/newEvent.reducerDescription';
import { editEventPageDesc } from 'capture-core/reducers/descriptions/editEvent.reducerDescription';
import { organisationUnitDesc } from 'capture-core/reducers/descriptions/organisationUnits.reducerDescription';
import { networkStatusDesc } from 'capture-core/reducers/descriptions/networkStatus.reducerDescription';

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
    dataEntriesFieldsMetaDesc,
    dataEntriesFieldsUIDesc,
    feedbackDesc,
    rulesEffectsHiddenFieldsDesc,
    rulesEffectsErrorMessagesDesc,
    rulesEffectsHiddenSectionsDesc,
    rulesEffectsCompulsoryFieldsDesc,
    workingListsDesc,
    workingListsMetaDesc,
    workingListsUIDesc,
    workingListsColumnsOrderDesc,
    workingListsContextDesc,
    workingListFiltersEditDesc,
    workingListsAppliedFiltersDesc,
    mainPageDesc,
    newEventPageDesc,
    editEventPageDesc,
    organisationUnitDesc,
    networkStatusDesc,
];
