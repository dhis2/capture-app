import type { ProgramStage } from '../../../../metaData';
import { getEventDateValidatorContainers } from './fieldValidators';
import { getConvertGeometryIn, convertGeometryOut, convertStatusIn, convertStatusOut } from '../../converters';

export const stageMainDataIds = {
    OCCURRED_AT: 'stageOccurredAt',
    ORG_UNIT: 'stageOrgUnit',
    COMPLETE: 'stageComplete',
    GEOMETRY: 'stageGeometry',
    ASSIGNEE: 'assignee',
};

const stageMainDataRulesEngineIds = {
    OCCURRED_AT: 'occurredAt',
    ORG_UNIT: 'orgUnit',
    COMPLETE: 'complete',
    GEOMETRY: 'geometry',
};

export const convertToRulesEngineIds = (id: string) => stageMainDataRulesEngineIds[id];

export const getDataEntryPropsToInclude = (firstStage: ProgramStage) => [
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
        onConvertIn: getConvertGeometryIn(firstStage.stageForm),
        onConvertOut: convertGeometryOut,
        featureType: firstStage.stageForm.featureType,
    },
    ...(firstStage.enableUserAssignment ? [{
        id: stageMainDataIds.ASSIGNEE,
        type: 'ASSIGNEE',
    }] : []),
];
