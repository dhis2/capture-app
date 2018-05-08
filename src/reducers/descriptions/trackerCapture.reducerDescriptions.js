// @flow
import { formsValuesDesc, formsSectionsFieldsUIDesc } from 'capture-core/reducers/descriptions/form.reducerDescription';
import { eventsDesc, eventsValuesDesc } from 'capture-core/reducers/descriptions/events.reducerDescription';
import { dataEntriesDesc, dataEntriesUIDesc, dataEntriesFieldsValueDesc, dataEntriesFieldsMetaDesc, dataEntriesFieldsUIDesc } from 'capture-core/reducers/descriptions/dataEntry.reducerDescription';
import { feedbackDesc } from 'capture-core/reducers/descriptions/feedback.reducerDescription';
import { eventsRulesEffectsHiddenFieldsDesc, eventsRulesEffectsErrorMessagesDesc, eventsRulesEffectsHiddenSectionsDesc, eventsRulesEffectsCompulsoryFieldsDesc } from 'capture-core/reducers/descriptions/rulesEffects.reducerDescription';
import { workingListsDesc, workingListsMetaDesc, workingListsUIDesc, workingListsColumnsOrderDesc } from 'capture-core/reducers/descriptions/workingLists.reducerDescription';
import { mainPageDesc } from 'capture-core/reducers/descriptions/mainPage.reducerDescription';
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
    eventsRulesEffectsHiddenFieldsDesc,
    eventsRulesEffectsErrorMessagesDesc,
    eventsRulesEffectsHiddenSectionsDesc,
    eventsRulesEffectsCompulsoryFieldsDesc,
    workingListsDesc,
    workingListsMetaDesc,
    workingListsUIDesc,
    workingListsColumnsOrderDesc,
    mainPageDesc,
];
