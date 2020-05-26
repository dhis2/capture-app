// @flow
import log from 'loglevel';
import { batchActions } from 'redux-batched-actions';

import metaDataCollection from '../../../metaDataMemoryStores/programCollection/programCollection';
import DataElement from '../../../metaData/DataElement/DataElement';
import { convertValue } from '../../../converters/clientToForm';
import { errorCreator } from 'capture-core-utils';
import { actionCreator } from '../../../actions/actions.utils';
import { addFormData } from '../../D2Form/actions/form.actions';
import { getRulesActionsOnLoad, getRulesActionsOnLoadForSingleNewEvent } from '../../../rules/actionsCreator/rulesEngineActionsCreatorForEvent';

export const actionTypes = {
    START_LOAD_DATA_ENTRY_EVENT: 'StartLoadDataEntryEvent',
    OPEN_DATA_ENTRY_EVENT_ALREADY_LOADED: 'OpenDataEntryEventAlreadyLoaded',
    LOAD_DATA_ENTRY_EVENT: 'LoadDataEntryEvent',
    LOAD_DATA_ENTRY_EVENT_FAILED: 'LoadDataEntryEventFailed',
    OPEN_NEW_EVENT_IN_DATA_ENTRY: 'OpenNewEventInDataEntry',
};

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    STAGE_NOT_FOUND: 'Stage not found',
};

type DataEntryPropToIncludeStandard = {|
    id: string,
    type: string,
|};

type DataEntryPropToIncludeSpecial = {|
    clientId: string,
    dataEntryId: string,
    onConvertIn: (value: any) => any,
    onConvertOut: (dataEntryValue: any, prevValue: any) => any,
|};

type DataEntryPropToInclude = DataEntryPropToIncludeStandard | DataEntryPropToIncludeSpecial;

export const startLoadDataEntryEvent =
    (eventId: string, eventPropsToInclude?: ?Array<DataEntryPropToInclude>, dataEntryId?: ?string = 'main') =>
        actionCreator(actionTypes.START_LOAD_DATA_ENTRY_EVENT)({ eventId, eventPropsToInclude, dataEntryId });


function getDataEntryValues(dataEntryPropsToInclude: Array<DataEntryPropToInclude>, event: Event) {
    const standardValuesArray = dataEntryPropsToInclude
        // $FlowSuppress :flow filter problem
        .filter(propToInclude => propToInclude.type)
        // $FlowSuppress :flow filter problem
        .map((propToInclude: DataEntryPropToIncludeStandard) => new DataElement((o) => {
            o.id = propToInclude.id;
            o.type = propToInclude.type;
        }))
        .map(dataElement => ({
            id: dataElement.id,
            value: dataElement.convertValue(event[dataElement.id], convertValue),
        }));

    const specialValuesArray = dataEntryPropsToInclude
        // $FlowSuppress :flow filter problem
        .filter(propToInclude => propToInclude.onConvertIn)
        // $FlowSuppress :flow filter problem
        .map((propToInclude: DataEntryPropToIncludeSpecial) => ({
            id: propToInclude.dataEntryId,
            value: propToInclude.onConvertIn(event[propToInclude.clientId]),
        }));

    return [...standardValuesArray, ...specialValuesArray]
        .reduce((accConvertedValues, valueItem: { id: string, value: any }) => {
            accConvertedValues[valueItem.id] = valueItem.value;
            return accConvertedValues;
        }, {});
}

function getDataEntryMeta(dataEntryPropsToInclude: Array<DataEntryPropToInclude>) {
    return dataEntryPropsToInclude
        .reduce((accMeta, propToInclude) => {
            // $FlowSuppress
            accMeta[propToInclude.id || propToInclude.dataEntryId] =
                propToInclude.type ?
                    { type: propToInclude.type } :
                    // $FlowSuppress
                    { onConvertOut: propToInclude.onConvertOut.toString(), clientId: propToInclude.clientId };
            return accMeta;
        }, {});
}

function handleDataEntryPropsToInclude(dataEntryPropsToInclude: ?Array<DataEntryPropToInclude>, event: Event) {
    let dataEntryValues;
    let dataEntryMeta;

    if (dataEntryPropsToInclude) {
        dataEntryValues = getDataEntryValues(dataEntryPropsToInclude, event);
        dataEntryMeta = getDataEntryMeta(dataEntryPropsToInclude);
    }

    return { dataEntryValues, dataEntryMeta };
}

export function loadDataEntryEvent(
    eventId: string,
    state: ReduxState,
    dataEntryPropsToInclude?: ?Array<DataEntryPropToInclude>,
    id: string) {
    const event: Event = state.events[eventId];
    const eventValues = state.eventsValues[eventId];

    const program = metaDataCollection.get(event.programId);
    if (!program) {
        log.error(errorCreator(errorMessages.PROGRAM_NOT_FOUND)({ action: 'openDataEntry', event }));
        return actionCreator(actionTypes.LOAD_DATA_ENTRY_EVENT_FAILED)();
    }

    // $FlowSuppress TODO: TEI
    const stage = program.getStage(event.programStageId);
    if (!stage) {
        log.error(errorCreator(errorMessages.STAGE_NOT_FOUND)({ action: 'openDataEntry', event }));
        return actionCreator(actionTypes.LOAD_DATA_ENTRY_EVENT_FAILED)();
    }

    const convertedValues = stage.convertValues(eventValues, convertValue);

    // dataEntryPropsToInclude
    const { dataEntryValues, dataEntryMeta } = handleDataEntryPropsToInclude(dataEntryPropsToInclude, event);

    return batchActions([
        actionCreator(actionTypes.LOAD_DATA_ENTRY_EVENT)({ eventId, id, dataEntryValues, dataEntryMeta }),
        addFormData(eventId, convertedValues),
        ...getRulesActionsOnLoad(eventId, state, eventId, id),
    ]);
}

export const openDataEntryEventAlreadyLoaded =
    (eventId: string, dataEntryId: string) =>
        actionCreator(actionTypes.OPEN_DATA_ENTRY_EVENT_ALREADY_LOADED)({ eventId, dataEntryId });

export const openNewEventInDataEntry =
    (eventPropsToInclude?: ?Array<DataEntryPropToInclude>, dataEntryId?: string = 'main', programId: string, orgUnit: Object) => {
        const eventId = 'newEvent';
        const dataEntryMeta = eventPropsToInclude ? getDataEntryMeta(eventPropsToInclude) : {};
        return batchActions([
            actionCreator(actionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY)({ eventId, dataEntryId, dataEntryMeta }),
            addFormData(eventId, {}),
            ...getRulesActionsOnLoadForSingleNewEvent(programId, eventId, eventId, dataEntryId, orgUnit),
        ]);
    };
