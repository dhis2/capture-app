// @flow
import { effectActions } from '@dhis2/rules-engine-javascript';
import type { OutputEffect, HideOutputEffect, AssignOutputEffect, OutputEffects } from '@dhis2/rules-engine-javascript';
import { type RenderFoundation, dataElementTypes } from '../metaData';

const isValidOptionSet = (optionSet, effectValue) => {
    if (!optionSet.options || effectValue === null || effectValue === '') {
        return false;
    }
    // Using == because effect.value is always a string whereas option.value can be a number
    if (optionSet.dataElementType === dataElementTypes.MULTI_TEXT) {
        return effectValue.split(',').every(value => optionSet.options.some(option => option.value == value));
    }
    return optionSet.options.some(option => option.value == effectValue);
};

const getAssignEffectsBasedOnHideField = (hideEffects: Array<HideOutputEffect>) =>
    hideEffects
        .map(({ id }) => ({
            id,
            value: null,
            type: effectActions.ASSIGN_VALUE,
        }));

const deduplicateEffectArray = (effectArray: Array<OutputEffect>) => {
    const dedupedEffectsAsMap = new Map(effectArray.map(effect => [effect.id, effect]));
    return [...dedupedEffectsAsMap.values()];
};

const postProcessAssignEffects = ({
    foundation,
    assignValueEffects,
    hideFieldEffects,
}: {
    foundation: RenderFoundation,
    assignValueEffects: Array<AssignOutputEffect>,
    hideFieldEffects: Array<HideOutputEffect>,
}) => {
    const optionSets = foundation.getElements().filter(({ optionSet }) => optionSet).reduce((acc, { id, optionSet }) => {
        // $FlowFixMe
        acc[id] = { options: optionSet.options, dataElementType: optionSet.dataElement.type };
        return acc;
    }, {});

    // If a value gets assigned to an option set it must match one of its available options
    assignValueEffects.map((effect) => {
        if (optionSets[effect.id] && !isValidOptionSet(optionSets[effect.id], effect.value)) {
            effect.value = null;
        }
        return effect;
    });

    // assignValueEffects has precedence over "blank a hidden field"-assignments.
    // This requirement is met by destructuring assignValueEffects *last*.
    return deduplicateEffectArray([
        ...getAssignEffectsBasedOnHideField(hideFieldEffects),
        ...assignValueEffects,
    ]);
};

const postProcessHideSectionEffects = (
    hideSectionEffects: Array<HideOutputEffect>,
    foundation: RenderFoundation,
) => (hideSectionEffects.flatMap(({ id: sectionId }) => {
    const section = foundation.getSection(sectionId);
    if (!section) {
        return [];
    }

    return [...section.elements.values()]
        .map(({ id }) => ({
            id,
            type: effectActions.HIDE_FIELD,
        }));
}));

const filterHideEffects = (
    hideEffects: Array<HideOutputEffect>,
    makeCompulsoryEffects: { [id: string]: Array<OutputEffect> },
    foundation: RenderFoundation,
) => {
    const compulsoryElements = foundation.getElements().filter(({ compulsory }) => compulsory).reduce((acc, { id }) => {
        acc[id] = true;
        return acc;
    }, {});

    const nonCompulsoryHideEffects = hideEffects
        .filter(({ id }) => !(compulsoryElements[id] || makeCompulsoryEffects[id]));

    return deduplicateEffectArray(nonCompulsoryHideEffects);
};

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

    const hideSectionFieldEffects = postProcessHideSectionEffects(
        hideSectionEffects,
        foundation,
    );

    const filteredHideFieldEffects = filterHideEffects(
        [...hideFieldEffects, ...hideSectionFieldEffects],
        compulsoryEffectsObject,
        foundation,
    );

    const filteredAssignValueEffects = postProcessAssignEffects({
        foundation,
        // $FlowFixMe
        assignValueEffects,
        hideFieldEffects,
    });

    return [
        ...rest,
        ...filteredHideFieldEffects,
        ...filteredAssignValueEffects,
    ];
}
