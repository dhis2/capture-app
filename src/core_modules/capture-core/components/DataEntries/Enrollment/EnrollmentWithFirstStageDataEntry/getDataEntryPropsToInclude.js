// @flow
import type { RenderFoundation } from '../../../../metaData';
import { getEventDateValidatorContainers } from './fieldValidators';
import { getConvertGeometryIn, convertGeometryOut, convertStatusIn, convertStatusOut } from '../../converters';

export const stageMainDataIds = {
    OCCURRED_AT: 'stageOccurredAt',
    COMPLETE: 'stageComplete',
    GEOMETRY: 'stageGeometry',
};

export const getDataEntryPropsToInclude = (formFoundation: RenderFoundation) => [
    {
        id: stageMainDataIds.OCCURRED_AT,
        type: 'DATE',
        validatorContainers: getEventDateValidatorContainers(),
    },
    {
        clientId: stageMainDataIds.COMPLETE,
        dataEntryId: stageMainDataIds.COMPLETE,
        onConvertIn: convertStatusIn,
        onConvertOut: convertStatusOut,
    },
    {
        clientId: stageMainDataIds.GEOMETRY,
        dataEntryId: stageMainDataIds.GEOMETRY,
        onConvertIn: getConvertGeometryIn(formFoundation),
        onConvertOut: convertGeometryOut,
        featureType: formFoundation.featureType,
    },
];
