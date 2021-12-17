// @flow
import { effectActions } from 'capture-core-utils/rulesEngine';
import type { OutputEffect, HideOutputEffect, AssignOutputEffect, OutputEffects } from 'capture-core-utils/rulesEngine';
import type { RenderFoundation } from '.././metaData';

const getAssignEffectsBasedOnHideField = (hideEffects: Array<HideOutputEffect>) =>
    hideEffects
        .map(({ id }) => ({
            id,
            value: null,
            type: effectActions.ASSIGN_VALUE,
        }));

const getAssignEffectsBasedOnHideSection = (
    hideSectionEffects: Array<HideOutputEffect>,
    foundation: RenderFoundation,
) => hideSectionEffects
    .flatMap(({ id: sectionId }) => {
        const section = foundation.getSection(sectionId);
        if (!section) {
            return [];
        }

        return [...section.elements.values()]
            .map(({ id }) => ({
                id,
                value: null,
                type: effectActions.ASSIGN_VALUE,
            }));
    });

const postProcessAssignEffects = ({
    assignValueEffects,
    hideFieldEffects,
    hideSectionEffects,
    foundation,
}: {
    assignValueEffects: Array<AssignOutputEffect>,
    hideFieldEffects: Array<HideOutputEffect>,
    hideSectionEffects: Array<HideOutputEffect>,
    foundation: RenderFoundation,
}) => {
    const fromHideFieldArray = getAssignEffectsBasedOnHideField(hideFieldEffects);
    const fromHideSectionArray = getAssignEffectsBasedOnHideSection(hideSectionEffects, foundation);

    const dedupedEffectsAsMap = new Map([
        ...assignValueEffects,
        ...fromHideFieldArray,
        ...fromHideSectionArray,
    ].map(effect => [effect.id, effect]));


    return [...dedupedEffectsAsMap.values()];
};

const filterHideEffects = (
    hideEffects: Array<HideOutputEffect>,
    makeCompulsoryEffects: { [id: string]: Array<OutputEffect> },
    foundation: RenderFoundation,
) => {
    const compulsoryElements = foundation.getElements().filter(({ compulsory }) => compulsory).reduce((acc, { id }) => {
        acc[id] = true;
        return acc;
    }, {});

    return hideEffects
        .filter(({ id }) => !(compulsoryElements[id] || makeCompulsoryEffects[id]));
};

const filterHideSectionEffects = (
    hideSectionEffects: Array<HideOutputEffect>,
    makeCompulsoryEffects: { [id: string]: Array<OutputEffect> },
    foundation: RenderFoundation,
) => hideSectionEffects
    .filter(({ id: sectionId }) => {
        const section = foundation.getSection(sectionId);
        if (!section) {
            return false;
        }

        return ![...section.elements.values()]
            .some(({ compulsory, id }) => compulsory || makeCompulsoryEffects[id]);
    });

export function postProcessRulesEffects(
    rulesEffects: OutputEffects = [],
    foundation: RenderFoundation,
) {
    const elementsById = foundation.getElementsById();
    const scopeFilteredRulesEffects = rulesEffects.filter(({ targetDataType, id }) =>
        !targetDataType || elementsById[id]);

    const {
        [effectActions.HIDE_FIELD]: hideFieldEffects,
        [effectActions.HIDE_SECTION]: hideSectionEffects,
        [effectActions.ASSIGN_VALUE]: assignValueEffects,
        rest,
    } = scopeFilteredRulesEffects
        .reduce((acc, effect) => {
            const { type } = effect;
            if ([effectActions.HIDE_FIELD, effectActions.HIDE_SECTION, effectActions.ASSIGN_VALUE].includes(type)) {
                // $FlowFixMe
                acc[type].push(effect);
            } else {
                acc.rest.push(effect);
            }
            return acc;
        }, {
            [effectActions.HIDE_FIELD]: [],
            [effectActions.HIDE_SECTION]: [],
            [effectActions.ASSIGN_VALUE]: [],
            rest: [],
        });

    const compulsoryEffectsObject = scopeFilteredRulesEffects
        .reduce((acc, effect) => {
            if (effect.type === effectActions.MAKE_COMPULSORY) {
                acc[effect.id] = effect;
            }
            return acc;
        }, {});

    const filteredHideFieldEffects = filterHideEffects(
        hideFieldEffects,
        compulsoryEffectsObject,
        foundation,
    );

    const filteredHideSectionEffects = filterHideSectionEffects(
        hideSectionEffects,
        compulsoryEffectsObject,
        foundation,
    );

    const filteredAssignValueEffects = postProcessAssignEffects({
        // $FlowFixMe
        assignValueEffects,
        hideFieldEffects: filteredHideFieldEffects,
        hideSectionEffects: filteredHideSectionEffects,
        foundation,
    });

    return [
        ...rest,
        ...filteredHideFieldEffects,
        ...filteredHideSectionEffects,
        ...filteredAssignValueEffects,
    ];
}
