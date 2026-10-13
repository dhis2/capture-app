import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';

export type CategoryOptionCombo = {
    id: string;
    categoryOptions: Array<{ id: string }>;
};

type EnrollmentCategory = {
    id: string;
    displayName: string;
};

export const resolveAttributeOptionCombo = (
    categoryOptionCombos: ReadonlyArray<CategoryOptionCombo>,
    categoryOptionUids: ReadonlyArray<string>,
    enrollmentCategoryComboId?: string,
): string | undefined => {
    if (categoryOptionUids.length === 0) return undefined;

    const target = new Set(categoryOptionUids);
    const matches = categoryOptionCombos.filter(coc =>
        coc.categoryOptions.length === categoryOptionUids.length &&
        coc.categoryOptions.every(({ id }) => target.has(id)),
    );

    if (matches.length > 1) {
        log.error(
            errorCreator('Multiple category option combos match the same option set')({
                enrollmentCategoryComboId,
                matches: matches.map(({ id }) => id),
                categoryOptionUids,
            }),
        );
        return undefined;
    }

    return matches[0]?.id;
};

export type EnrollmentCategoryCombination = {
    id: string;
    displayName: string;
    categories: Array<EnrollmentCategory>;
    categoryOptionCombos: Array<CategoryOptionCombo>;
    resolveAttributeOptionCombo: (uids: ReadonlyArray<string>) => string | undefined;
};

export const createEnrollmentCategoryCombination = (input: {
    id: string;
    displayName: string;
    categories: Array<EnrollmentCategory>;
    categoryOptionCombos: Array<CategoryOptionCombo>;
}): EnrollmentCategoryCombination => ({
    ...input,
    resolveAttributeOptionCombo: uids =>
        resolveAttributeOptionCombo(input.categoryOptionCombos, uids, input.id),
});
