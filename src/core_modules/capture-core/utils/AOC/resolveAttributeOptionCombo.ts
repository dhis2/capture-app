import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';

type CategoryOptionCombo = {
    id: string;
    categoryOptions: Array<{ id: string }>;
};

// Enrollment import requires a resolved attributeOptionCombo UID. The category
// combo's option combos are cached with program metadata, so this resolution
// is purely local (works offline). Pick the COC whose option set is identical
// to the user's picks.
export const resolveAttributeOptionCombo = (
    categoryOptionCombos: ReadonlyArray<CategoryOptionCombo>,
    categoryOptionUids: ReadonlyArray<string>,
): string | undefined => {
    if (categoryOptionUids.length === 0) return undefined;

    const target = new Set(categoryOptionUids);
    const matches = categoryOptionCombos.filter(coc =>
        coc.categoryOptions.length === target.size &&
        coc.categoryOptions.every(({ id }) => target.has(id)),
    );

    if (matches.length > 1) {
        log.error(
            errorCreator('Multiple category option combos match the same option set')({
                matches: matches.map(({ id }) => id),
                categoryOptionUids,
            }),
        );
        return undefined;
    }

    return matches[0]?.id;
};
