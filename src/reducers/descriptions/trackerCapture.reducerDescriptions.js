// @flow
import { formsValuesDesc } from 'capture-core/reducers/descriptions/form.reducerDescription';
import { eventsDesc, eventsValuesDesc } from 'capture-core/reducers/descriptions/events.reducerDescription';
import { dataEntryDesc } from 'capture-core/reducers/descriptions/dataEntry.reducerDescription';
import { feedbackDesc } from 'capture-core/reducers/descriptions/feedback.reducerDescription';

import { appReducerDesc } from './app.reducerDescription';


export default [
    appReducerDesc,
    formsValuesDesc,
    eventsDesc,
    eventsValuesDesc,
    dataEntryDesc,
    feedbackDesc,
];
