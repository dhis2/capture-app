// @flow
import { effectActions } from '../engine';
import type { OutputEffect, HideOutputEffect, AssignOutputEffect, OutputEffects } from '../engine';
import type { RenderFoundation } from '../../metaData';

function getAssignEffects(assignEffects: ?{ [elementId: string]: Array<AssignOutputEffect> }) {
    if (!assignEffects) {
        return [];
    }

    return Object
        .keys(assignEffects)
        .map((elementId: string) => {
            const effectsForId = assignEffects[elementId];
            const applicableEffectForId = effectsForId[effectsForId.length - 1];
            return {
                id: applicableEffectForId.id,
                value: applicableEffectForId.value,
            };
        });
}
/*
reset values for hidden fields
*/
function getAssignEffectsBasedOnHideField(hideEffects: ?{ [elementId: string]: Array<HideOutputEffect> }) {
    if (!hideEffects) {
        return [];
    }

    return Object
        .keys(hideEffects)
        .map((elementId: string) => ({
            id: elementId,
            value: null,
        }));
}

/*
reset values for fields in hidden sections
*/
function getAssignEffectsBasedOnHideSection(
    hideEffects: ?{ [sectionId: string]: Array<HideOutputEffect> },
    foundation: RenderFoundation,
) {
    if (!hideEffects) {
        return [];
    }

    return Object.keys(hideEffects)
        .map((sectionId: string) => {
            const section = foundation.getSection(sectionId);

            if (!section) {
                return null;
            }

            return Array.from(section.elements.entries())
                .map(entry => entry[1])
                .map(element => ({
                    id: element.id,
                    value: null,
                }));
        })
        .filter(sectionEffects => sectionEffects)

        // $FlowFixMe[prop-missing] automated comment
        .reduce((accEffects, sectionEffects) => [...accEffects, ...sectionEffects], []);
}

function postProcessAssignEffects(
    assignEffects: ?{ [elementId: string]: Array<AssignOutputEffect> },
    hideEffects: ?{ [elementId: string]: Array<HideOutputEffect> },
    sectionHideEffects: ?{ [sectionId: string]: Array<HideOutputEffect> },
    foundation: RenderFoundation,
) {
    const fromAssignsArray = getAssignEffects(assignEffects);
    const fromHideFieldArray = getAssignEffectsBasedOnHideField(hideEffects);
    const formHideSectionArray = getAssignEffectsBasedOnHideSection(sectionHideEffects, foundation);

    const processedHideEffectsArray = [
        ...fromAssignsArray,
        ...fromHideFieldArray,
        ...formHideSectionArray,
    ];

    return processedHideEffectsArray.reduce((accProcessedHideEffects, effect) => {
        accProcessedHideEffects[effect.id] = effect.value;
        return accProcessedHideEffects;
    }, {});
}

function buildEffectsHierarchy(effects: Array<OutputEffect>) {
    return effects.reduce((accEffectsObject, effect) => {
        const actionType = effect.type;
        accEffectsObject[actionType] = accEffectsObject[actionType] || {};

        const id = effect.id;

        // $FlowFixMe[incompatible-use] automated comment
        accEffectsObject[actionType][id] = accEffectsObject[actionType][id] || [];

        // $FlowFixMe[incompatible-use] automated comment
        accEffectsObject[actionType][id].push(effect);
        return accEffectsObject;
    }, {});
}
/*
Disable hiding for compulsory fields
*/
function filterFieldsHideEffects(
    hideEffects: ?{ [elementId: string]: Array<HideOutputEffect> },
    makeCompulsoryEffects: { [elementId: string]: Array<OutputEffect>} = {},
    foundation: RenderFoundation) {
    if (!hideEffects) {
        return hideEffects;
    }

    const elementIds = Object.keys(hideEffects);
    const compulsoryElements = foundation.getElements().filter(({ compulsory }) => compulsory);

    return elementIds
        .filter((elementId) => {
            const { compulsory: elementIsCompulsory } =
                compulsoryElements.find(({ id }) => id === elementId) || {};

            const compulsoryEffect = makeCompulsoryEffects[elementId];
            return !(elementIsCompulsory || compulsoryEffect);
        })
        .reduce((accFilteredEffects, elementId) => {
            accFilteredEffects[elementId] = hideEffects[elementId];
            return accFilteredEffects;
        }, {});
}

/*
Disable hiding of sections containing compulsory fields
*/
function filterSectionsHideEffects(
    hideEffects: ?{ [elementId: string]: Array<HideOutputEffect> },
    makeCompulsoryEffects: { [elementId: string]: Array<OutputEffect>} = {},
    foundation: RenderFoundation) {
    if (!hideEffects) {
        return hideEffects;
    }

    const sectionIds = Object.keys(hideEffects);
    return sectionIds
        .filter((sectionId) => {
            const section = foundation.getSection(sectionId);
            if (!section) {
                return false;
            }

            const compulsoryFieldFound = Array.from(section.elements.entries())
                .map(entry => entry[1])
                .some((element) => {
                    const dataCompulsory = element.compulsory;
                    const compulsoryEffect = makeCompulsoryEffects[element.id];
                    return dataCompulsory || compulsoryEffect;
                });

            return !compulsoryFieldFound;
        })
        .reduce((accFilteredEffects, sectionId) => {
            accFilteredEffects[sectionId] = hideEffects[sectionId];
            return accFilteredEffects;
        }, {});
}

export function postProcessRulesEffects(
    rulesEffects: ?OutputEffects,
    foundation: ?RenderFoundation) {
    if (!rulesEffects || !foundation) {
        return null;
    }

    const effectsHierarchy = buildEffectsHierarchy(rulesEffects);

    effectsHierarchy[effectActions.HIDE_FIELD] =
        filterFieldsHideEffects(
            effectsHierarchy[effectActions.HIDE_FIELD],
            effectsHierarchy[effectActions.MAKE_COMPULSORY],
            foundation,
        );
    effectsHierarchy[effectActions.HIDE_SECTION] =
        filterSectionsHideEffects(
            effectsHierarchy[effectActions.HIDE_SECTION],
            effectsHierarchy[effectActions.MAKE_COMPULSORY],
            foundation,
        );

    effectsHierarchy[effectActions.ASSIGN_VALUE] =
        postProcessAssignEffects(
            effectsHierarchy[effectActions.ASSIGN_VALUE],
            effectsHierarchy[effectActions.HIDE_FIELD],
            effectsHierarchy[effectActions.HIDE_SECTION],
            foundation,
        );

    return effectsHierarchy;
}
