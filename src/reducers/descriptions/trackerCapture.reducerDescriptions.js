// @flow
import { formsValuesDesc } from 'capture-core/reducers/descriptions/form.reducerDescription';
import { appReducerDesc } from './app.reducerDescription';
import { eventsDesc, eventsValuesDesc } from './events.reducerDescription';
import { dataEntryDesc } from './dataEntry.reducerDescription';

export default [
    appReducerDesc,
    formsValuesDesc,
    eventsDesc,
    eventsValuesDesc,
    dataEntryDesc,
];
