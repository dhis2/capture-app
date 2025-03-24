import { effectActions } from '@dhis2/rules-engine-javascript';
import type { OutputEffect, HideOutputEffect, AssignOutputEffect, OutputEffects } from '@dhis2/rules-engine-javascript';
import { type RenderFoundation, dataElementTypes } from '../metaData';

type OptionSet = {
    options?: Array<{value: string | number}>;
    dataElementType?: string;
};

const isValidOptionSet = (optionSet: OptionSet, effectValue: string | null): boolean => {
    if (!optionSet.options || effectValue === null || effectValue === '') {
        return false;
    }
    // Using == because effect.value is always a string whereas option.value can be a number
    if (optionSet.dataElementType === dataElementTypes.MULTI_TEXT) {
        return effectValue.split(',').every(value => optionSet.options?.some(option => option.value == value) || false);
    }
    return optionSet.options.some(option => option.value == effectValue);
};

const getAssignEffectsBasedOnHideField = (hideEffects: Array<HideOutputEffect>): Array<AssignOutputEffect> =>
    hideEffects
        .map(({ id }) => ({
            id,
            value: null,
            type: effectActions.ASSIGN_VALUE,
        }));

const deduplicateEffectArray = <T extends OutputEffect>(effectArray: Array<T>): Array<T> => {
    const dedupedEffectsAsMap = new Map(effectArray.map(effect => [effect.id, effect]));
    return [...dedupedEffectsAsMap.values()];
};

const postProcessAssignEffects = ({
    foundation,
    assignValueEffects,
    hideFieldEffects,
}: {
    foundation: RenderFoundation;
    assignValueEffects: Array<AssignOutputEffect>;
    hideFieldEffects: Array<HideOutputEffect>;
}): Array<AssignOutputEffect> => {
    const optionSets = foundation.getElements().filter(({ optionSet }) => optionSet).reduce<Record<string, OptionSet>>((acc, { id, optionSet }) => {
        if (optionSet) {
            acc[id] = { 
                options: optionSet.options, 
                dataElementType: optionSet.dataElement?.type 
            };
        }
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
): Array<HideOutputEffect> => (hideSectionEffects.flatMap(({ id: sectionId }) => {
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
    makeCompulsoryEffects: { [id: string]: OutputEffect },
    foundation: RenderFoundation,
): Array<HideOutputEffect> => {
    const compulsoryElements = foundation.getElements().filter(({ compulsory }) => compulsory).reduce<Record<string, boolean>>((acc, { id }) => {
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
): Array<OutputEffect> {
    const elementsById = foundation.getElementsById();
    const scopeFilteredRulesEffects = rulesEffects.filter(({ targetDataType, id }) =>
        !targetDataType || elementsById[id]);

    type EffectsAcc = {
        [effectActions.HIDE_FIELD]: Array<HideOutputEffect>;
        [effectActions.HIDE_SECTION]: Array<HideOutputEffect>;
        [effectActions.ASSIGN_VALUE]: Array<AssignOutputEffect>;
        rest: Array<OutputEffect>;
    };

    const {
        [effectActions.HIDE_FIELD]: hideFieldEffects,
        [effectActions.HIDE_SECTION]: hideSectionEffects,
        [effectActions.ASSIGN_VALUE]: assignValueEffects,
        rest,
    } = scopeFilteredRulesEffects
        .reduce<EffectsAcc>((acc, effect) => {
            const { type } = effect;
            if ([effectActions.HIDE_FIELD, effectActions.HIDE_SECTION, effectActions.ASSIGN_VALUE].includes(type)) {
                // Add type assertions to handle the correct type for each effect
                if (type === effectActions.HIDE_FIELD || type === effectActions.HIDE_SECTION) {
                    acc[type].push(effect as HideOutputEffect);
                } else if (type === effectActions.ASSIGN_VALUE) {
                    acc[type].push(effect as AssignOutputEffect);
                }
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
        .reduce<Record<string, OutputEffect>>((acc, effect) => {
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
        assignValueEffects,
        hideFieldEffects,
    });

    return [
        ...rest,
        ...filteredHideFieldEffects,
        ...filteredAssignValueEffects,
    ];
} 