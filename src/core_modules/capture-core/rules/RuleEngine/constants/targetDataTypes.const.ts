// @flow

export const rulesEngineEffectTargetDataTypes = Object.freeze({
    DATA_ELEMENT: 'dataElement',
    TRACKED_ENTITY_ATTRIBUTE: 'trackedEntityAttribute',
} as const);

export type RulesEngineEffectTargetDataType = typeof rulesEngineEffectTargetDataTypes[keyof typeof rulesEngineEffectTargetDataTypes];
