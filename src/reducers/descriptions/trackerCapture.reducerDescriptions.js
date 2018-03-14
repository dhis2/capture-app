// @flow
import { formsValuesDesc, formsSectionsFieldsUIDesc } from 'capture-core/reducers/descriptions/form.reducerDescription';
import { eventsDesc, eventsValuesDesc } from 'capture-core/reducers/descriptions/events.reducerDescription';
import { dataEntriesDesc, dataEntriesUIDesc, dataEntriesValuesDesc, dataEntriesValuesMetaDesc } from 'capture-core/reducers/descriptions/dataEntry.reducerDescription';
import { feedbackDesc } from 'capture-core/reducers/descriptions/feedback.reducerDescription';
import { eventsRulesEffectsHiddenFieldsDesc, eventsRulesEffectsErrorMessagesDesc, eventsRulesEffectsHiddenSectionsDesc, eventsRulesEffectsCompulsoryFieldsDesc } from 'capture-core/reducers/descriptions/rulesEffects.reducerDescription';

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
    dataEntriesValuesDesc,
    dataEntriesValuesMetaDesc,
    feedbackDesc,
    eventsRulesEffectsHiddenFieldsDesc,
    eventsRulesEffectsErrorMessagesDesc,
    eventsRulesEffectsHiddenSectionsDesc,
    eventsRulesEffectsCompulsoryFieldsDesc,
];
