// @flow
import { formsValuesDesc, formsSectionsFieldsUIDesc } from 'capture-core/reducers/descriptions/form.reducerDescription';
import { eventsDesc, eventsValuesDesc } from 'capture-core/reducers/descriptions/events.reducerDescription';
import { dataEntriesDesc, dataEntriesUIDesc, dataEntriesValuesDesc, dataEntriesValuesMetaDesc } from 'capture-core/reducers/descriptions/dataEntry.reducerDescription';
import { feedbackDesc } from 'capture-core/reducers/descriptions/feedback.reducerDescription';

import { appReducerDesc } from './app.reducerDescription';


export default [
    appReducerDesc,
    formsValuesDesc,
    formsSectionsFieldsUIDesc,
    eventsDesc,
    eventsValuesDesc,
    dataEntriesDesc,
    dataEntriesUIDesc,
    dataEntriesValuesDesc,
    dataEntriesValuesMetaDesc,
    feedbackDesc,
];
