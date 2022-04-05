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

const postProcessAssignEffects = ({
    assignValueEffects,
    hideFieldEffects,
}: {
    assignValueEffects: Array<AssignOutputEffect>,
    hideFieldEffects: Array<HideOutputEffect>,
}) => {
    const fromHideFieldArray = getAssignEffectsBasedOnHideField(hideFieldEffects);

    const dedupedEffectsAsMap = new Map([
        ...assignValueEffects,
        ...fromHideFieldArray,
    ].map(effect => [effect.id, effect]));


    return [...dedupedEffectsAsMap.values()];
};

const postProcessHideEffects = (
    hideSectionEffects: Array<HideOutputEffect>,
    hideFieldEffects: Array<HideOutputEffect>,
    makeCompulsoryEffects: { [id: string]: Array<OutputEffect> },
    foundation: RenderFoundation,
) => {
    const hideSectionFieldEffects = hideSectionEffects.flatMap(({ id: sectionId }) => {
        const section = foundation.getSection(sectionId);
        if (!section) {
            return [];
        }

        return [...section.elements.values()]
            .map(({ id }) => ({
                id,
                type: effectActions.HIDE_FIELD,
            }));
    });

    const dedupedEffectsAsMap = new Map([
        ...filterHideEffects(hideSectionFieldEffects, makeCompulsoryEffects, foundation),
        ...hideFieldEffects,
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
    foundation: RenderFoundation,
) => hideSectionEffects
    .filter(({ id: sectionId }) => foundation.getSection(sectionId));

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

    // Fields hidden explicitly with a "Hide Field" action will have their values erased:
    const filteredAssignValueEffects = postProcessAssignEffects({
        // $FlowFixMe
        assignValueEffects,
        hideFieldEffects: filteredHideFieldEffects,
    });

    const filteredHideSectionEffects = filterHideSectionEffects(
        hideSectionEffects,
        foundation,
    );

    // Hides all non-compulsory fields in hidden sections.
    // Fields hidden in this manner will NOT have their values erased.
    const allHideFieldEffects = postProcessHideEffects(
        filteredHideSectionEffects,
        filteredHideFieldEffects,
        compulsoryEffectsObject,
        foundation,
    );

    return [
        ...rest,
        ...allHideFieldEffects,
        ...filteredAssignValueEffects,
    ];
}
