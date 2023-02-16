// @flow
import type { OutputEffect } from '@dhis2/rules-engine-javascript';

export const buildEffectsHierarchy = (effects: Array<OutputEffect>) =>
    effects.reduce((accEffectsObject, effect) => {
        const { type, id } = effect;
        accEffectsObject[type] = accEffectsObject[type] || {};
        accEffectsObject[type][id] = accEffectsObject[type][id] || [];
        accEffectsObject[type][id].push(effect);
        return accEffectsObject;
    }, {});
