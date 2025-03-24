import type { OutputEffect } from '@dhis2/rules-engine-javascript';

type EffectsHierarchy = {
    [type: string]: {
        [id: string]: Array<OutputEffect>;
    };
};

export const buildEffectsHierarchy = (effects: Array<OutputEffect>): EffectsHierarchy =>
    effects.reduce((accEffectsObject: EffectsHierarchy, effect) => {
        const { type, id } = effect;
        accEffectsObject[type] = accEffectsObject[type] || {};
        accEffectsObject[type][id] = accEffectsObject[type][id] || [];
        accEffectsObject[type][id].push(effect);
        return accEffectsObject;
    }, {}); 