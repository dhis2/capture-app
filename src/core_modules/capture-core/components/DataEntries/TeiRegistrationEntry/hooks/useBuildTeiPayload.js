// @flow
import { useSelector } from 'react-redux';
import { useMetadataForRegistrationForm } from '../../common/TEIAndEnrollment/useMetadataForRegistrationForm';
import type { RenderFoundation } from '../../../../metaData';
import { convertClientToServer, convertFormToClient } from '../../../../converters';
import { generateUID } from '../../../../utils/uid/generateUID';
import { getDataEntryKey } from '../../../DataEntry/common/getDataEntryKey';
import type {
    TeiPayload,
} from '../../../Pages/common/TEIRelationshipsWidget/RegisterTei/DataEntry/TrackedEntityInstance/dataEntryTrackedEntityInstance.types';
import { geometryType, getPossibleTetFeatureTypeKey, buildGeometryProp } from '../../common/TEIAndEnrollment/geometry';

type Props = {
    trackedEntityTypeId: string,
    dataEntryId: string,
    orgUnitId: string,
    itemId?: string,
};

function getClientValuesForFormData(formValues: Object, formFoundation: RenderFoundation) {
    return formFoundation.convertValues(formValues, convertFormToClient);
}

const deriveAttributesFromFormValues = (formValues = {}) =>
    Object.keys(formValues)
        .filter(key => !geometryType(key))
        .map(key => ({ attribute: key, value: formValues[key] }));

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

        const attributes = deriveAttributesFromFormValues(serverValuesForFormValues);

        const tetFeatureTypeKey = getPossibleTetFeatureTypeKey(serverValuesForFormValues);
        const tetGeometry = tetFeatureTypeKey
            ? buildGeometryProp(tetFeatureTypeKey, formValues)
            : undefined;

        return {
            attributes,
            trackedEntity: generateUID(),
            orgUnit: orgUnitId,
            trackedEntityType: trackedEntityTypeId,
            geometry: tetGeometry,
            enrollments: [],
        };
    };

    return { buildTeiWithoutEnrollment };
};
