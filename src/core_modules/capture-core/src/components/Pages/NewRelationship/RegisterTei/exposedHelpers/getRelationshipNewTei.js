// @flow
import uuid from 'd2-utilizr/src/uuid';
import moment from '../../../../../utils/moment/momentResolver';
import {
    getTrackerProgramThrowIfNotFound,
    getTrackedEntityTypeThrowIfNotFound,
    RenderFoundation,
} from '../../../../../metaData';
import { convertFormToClient, convertClientToServer } from '../../../../../converters';
import getDisplayName from '../../../../../trackedEntityInstances/getDisplayName';
import convertDataEntryValuesToClientValues from '../../../../DataEntry/common/convertDataEntryValuesToClientValues';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';

function getTrackerProgramMetadata(programId: string) {
    const program = getTrackerProgramThrowIfNotFound(programId);
    return {
        form: program.enrollment.enrollmentForm,
        attributes: program.trackedEntityType.attributes,
        tetName: program.trackedEntityType.name,
    };
}

function getTETMetadata(tetId: string) {
    const tet = getTrackedEntityTypeThrowIfNotFound(tetId);
    return {
        form: tet.teiRegistration.form,
        attributes: tet.attributes,
        tetName: tet.name,
    };
}

function getMetadata(programId: ?string, tetId: string) {
    return programId ? getTrackerProgramMetadata(programId) : getTETMetadata(tetId);
}


function getClientValuesForFormData(formValues: Object, formFoundation: RenderFoundation) {
    const clientValues = formFoundation.convertValues(formValues, convertFormToClient);
    return clientValues;
}

function getServerValuesForMainValues(
    values: Object,
    meta: Object,
    formFoundation: RenderFoundation,
) {
    const clientValues = convertDataEntryValuesToClientValues(
        values,
        meta,
        null,
        formFoundation,
    ) || {};

    const serverValues = Object
        .keys(clientValues)
        .reduce((acc, key) => {
            const value = values[key];
            const type = meta[key].type;
            acc[key] = convertClientToServer(value, type);
            return acc;
        }, {});

    return serverValues;
}

export default function getRelationshipNewTei(dataEntryId: string, itemId: string, state: ReduxState) {
    const dataEntryKey = getDataEntryKey(dataEntryId, itemId);
    const formValues = state.formsValues[dataEntryKey];
    const { programId, orgUnit } = state.newRelationshipRegisterTei;
    const tetId = state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId;

    const { attributes, form: formFoundation, tetName } = getMetadata(programId, tetId);
    const clientValuesForFormData = getClientValuesForFormData(formValues, formFoundation);
    const displayName = getDisplayName(clientValuesForFormData, attributes, tetName);

    const serverValuesForFormValues = formFoundation.convertValues(clientValuesForFormData, convertClientToServer);
    const serverValuesForMainValues = getServerValuesForMainValues(
        state.dataEntriesFieldsValue[dataEntryKey],
        state.dataEntriesFieldsMeta[dataEntryKey],
        formFoundation,
    );

    const enrollment = programId ? {
        program: programId,
        status: 'ACTIVE',
        orgUnit: orgUnit.id,
        incidentDate: moment().format('YYYY-MM-DD'),
        ...serverValuesForMainValues,
    } : null;

    const teiPayload = {
        // $FlowFixMe
        attributes: Object
            .keys(serverValuesForFormValues)
            .map(key => ({
                attribute: key,
                value: serverValuesForFormValues[key],
            })),
        orgUnit: orgUnit.id,
        trackedEntityType: tetId,
        enrollments: enrollment ? [enrollment] : [],
    };

    return {
        data: teiPayload,
        name: displayName,
        id: uuid(),
    };
}
