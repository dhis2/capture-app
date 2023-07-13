// @flow
import type { RenderFoundation } from '../../../../metaData';
import { getEventDateValidatorContainers } from './fieldValidators';
import { getConvertGeometryIn, convertGeometryOut, convertStatusIn, convertStatusOut } from '../../converters';

export const getDataEntryPropsToInclude = (formFoundation: RenderFoundation) => [
    {
        id: 'stageOccurredAt',
        type: 'DATE',
        validatorContainers: getEventDateValidatorContainers(),
    },
    {
        clientId: 'stageComplete',
        dataEntryId: 'stageComplete',
        onConvertIn: convertStatusIn,
        onConvertOut: convertStatusOut,
    },
    {
        clientId: 'stageGeometry',
        dataEntryId: 'stageGeometry',
        onConvertIn: getConvertGeometryIn(formFoundation),
        onConvertOut: convertGeometryOut,
        featureType: formFoundation.featureType,
    },
];
