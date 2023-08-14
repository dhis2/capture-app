// @flow
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getDataEntryKey } from '../../../../../DataEntry/common/getDataEntryKey';
import { getTrackedEntityTypeThrowIfNotFound, getTrackerProgramThrowIfNotFound } from '../../../../../../metaData';
import type { RenderFoundation } from '../../../../../../metaData';
import { convertClientToServer, convertFormToClient } from '../../../../../../converters';
import {
    convertDataEntryValuesToClientValues,
} from '../../../../../DataEntry/common/convertDataEntryValuesToClientValues';
import { getFormattedStringFromMomentUsingEuropeanGlyphs } from '../../../../../../../capture-core-utils/date';
import { capitalizeFirstLetter } from '../../../../../../../capture-core-utils/string';
import { generateUID } from '../../../../../../utils/uid/generateUID';

type DataEntryReduxConverterProps = {
    dataEntryId: string;
    itemId: string;
    trackedEntityTypeId: string;
};

function getMetadata(programId: ?string, tetId: string) {
    return programId ? getTrackerProgramMetadata(programId) : getTETMetadata(tetId);
}

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
        formFoundation,
    ) || {};

    // potientally run this through a server to client converter for enrollment, the same way as for event
    const serverValues = Object
        .keys(clientValues)
        .reduce((acc, key) => {
            const value = clientValues[key];
            const type = meta[key].type;
            acc[key] = convertClientToServer(value, type);
            return acc;
        }, {});

    return serverValues;
}

function getPossibleTetFeatureTypeKey(serverValues: Object) {
    return Object
        .keys(serverValues)
        .find(key => key.startsWith('FEATURETYPE_'));
}

function buildGeometryProp(key: string, serverValues: Object) {
    if (!serverValues[key]) {
        return undefined;
    }
    const type = capitalizeFirstLetter(key.replace('FEATURETYPE_', '').toLocaleLowerCase());
    return {
        type,
        coordinates: serverValues[key],
    };
}

export const useDataEntryReduxConverter = ({
    dataEntryId,
    itemId,
    trackedEntityTypeId,
}: DataEntryReduxConverterProps) => {
    const dataEntryKey = getDataEntryKey(dataEntryId, itemId);
    const formValues = useSelector(({ formsValues }) => formsValues[dataEntryKey]);
    const dataEntryFieldValues = useSelector(({ dataEntriesFieldsValue }) => dataEntriesFieldsValue[dataEntryKey]);
    const dataEntryFieldsMeta = useSelector(({ dataEntriesFieldsMeta }) => dataEntriesFieldsMeta[dataEntryKey]);
    const { programId, orgUnit } = useSelector(({ newRelationshipRegisterTei }) => newRelationshipRegisterTei);

    const buildTeiPayload = () => {
        const { form: formFoundation } = getMetadata(programId, trackedEntityTypeId);
        const clientValues = getClientValuesForFormData(formValues, formFoundation);
        const serverValuesForFormValues = formFoundation.convertValues(clientValues, convertClientToServer);
        const serverValuesForMainValues = getServerValuesForMainValues(
            dataEntryFieldValues,
            dataEntryFieldsMeta,
            formFoundation,
        );

        // $FlowFixMe
        const attributes = Object.keys(serverValuesForFormValues)
            .map(key => ({
                attribute: key,
                value: serverValuesForFormValues[key],
            }));

        const enrollment = programId ? {
            program: programId,
            status: 'ACTIVE',
            orgUnit: orgUnit.id,
            occurredAt: getFormattedStringFromMomentUsingEuropeanGlyphs(moment()),
            attributes,
            ...serverValuesForMainValues,
        } : null;

        const tetFeatureTypeKey = getPossibleTetFeatureTypeKey(serverValuesForFormValues);
        let geometry;
        if (tetFeatureTypeKey) {
            geometry = buildGeometryProp(tetFeatureTypeKey, serverValuesForFormValues);
            delete serverValuesForFormValues[tetFeatureTypeKey];
        }

        return {
            // $FlowFixMe
            attributes: !enrollment ? attributes : undefined,
            trackedEntity: generateUID(),
            orgUnit: orgUnit.id,
            trackedEntityType: trackedEntityTypeId,
            geometry,
            enrollments: enrollment ? [enrollment] : [],
        };
    };


    return {
        buildTeiPayload,
    };
};
