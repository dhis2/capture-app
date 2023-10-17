// @flow
import { useSelector } from 'react-redux';
import { useMetadataForRegistrationForm } from '../../common/TEIAndEnrollment/useMetadataForRegistrationForm';
import type { RenderFoundation } from '../../../../metaData';
import { convertClientToServer, convertFormToClient } from '../../../../converters';
import { capitalizeFirstLetter } from '../../../../../capture-core-utils/string';
import { generateUID } from '../../../../utils/uid/generateUID';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import type {
    TeiPayload,
} from '../../../Pages/common/TEIRelationshipsWidget/RegisterTei/DataEntry/TrackedEntityInstance/dataEntryTrackedEntityInstance.types';

type Props = {
    trackedEntityTypeId: string,
    dataEntryId: string,
    orgUnitId: string,
    itemId?: string,
};

function getClientValuesForFormData(formValues: Object, formFoundation: RenderFoundation) {
    return formFoundation.convertValues(formValues, convertFormToClient);
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

export const useBuildTeiPayload = ({
    trackedEntityTypeId,
    dataEntryId,
    itemId = 'newTei',
    orgUnitId,
}: Props) => {
    const dataEntryKey = getDataEntryKey(dataEntryId, itemId);
    const { formFoundation } = useMetadataForRegistrationForm({ selectedScopeId: trackedEntityTypeId });
    const formValues = useSelector(({ formsValues }) => formsValues[dataEntryKey]);

    const buildTeiWithoutEnrollment = (): TeiPayload => {
        if (!formFoundation) throw Error('form foundation object not found');
        const clientValues = getClientValuesForFormData(formValues, formFoundation);
        const serverValuesForFormValues = formFoundation.convertValues(clientValues, convertClientToServer);

        // $FlowFixMe
        const attributes = Object.keys(serverValuesForFormValues)
            .map(key => ({
                attribute: key,
                value: serverValuesForFormValues[key],
            }));

        const tetFeatureTypeKey = getPossibleTetFeatureTypeKey(serverValuesForFormValues);
        let geometry;
        if (tetFeatureTypeKey) {
            geometry = buildGeometryProp(tetFeatureTypeKey, serverValuesForFormValues);
            delete serverValuesForFormValues[tetFeatureTypeKey];
        }

        return {
            attributes,
            trackedEntity: generateUID(),
            orgUnit: orgUnitId,
            trackedEntityType: trackedEntityTypeId,
            geometry,
            enrollments: [],
        };
    };

    return { buildTeiWithoutEnrollment };
};
