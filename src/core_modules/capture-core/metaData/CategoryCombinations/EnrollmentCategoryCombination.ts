/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import isFunction from 'd2-utilizr/lib/isFunction';
import { errorCreator } from 'capture-core-utils';

export type CategoryOptionCombo = {
    id: string;
    categoryOptions: Array<{ id: string }>;
};

export const resolveAttributeOptionCombo = (
    categoryOptionCombos: ReadonlyArray<CategoryOptionCombo>,
    categoryOptionUids: ReadonlyArray<string>,
    context?: { enrollmentCategoryComboId?: string },
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
                ...context,
                matches: matches.map(({ id }) => id),
                categoryOptionUids,
            }),
        );
        return undefined;
    }

    return matches[0]?.id;
};

export class EnrollmentCategoryCombination {
    _id = '';
    _categoryOptionCombos: Array<CategoryOptionCombo> = [];

    constructor(initFn: ((_this: EnrollmentCategoryCombination) => void) | null) {
        initFn && isFunction(initFn) && initFn(this);
    }

    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get categoryOptionCombos(): Array<CategoryOptionCombo> {
        return this._categoryOptionCombos;
    }

    set categoryOptionCombos(categoryOptionCombos: Array<CategoryOptionCombo>) {
        this._categoryOptionCombos = categoryOptionCombos;
    }

    resolveAttributeOptionCombo(categoryOptionUids: ReadonlyArray<string>): string | undefined {
        return resolveAttributeOptionCombo(
            this._categoryOptionCombos,
            categoryOptionUids,
            { enrollmentCategoryComboId: this._id },
        );
    }
}
