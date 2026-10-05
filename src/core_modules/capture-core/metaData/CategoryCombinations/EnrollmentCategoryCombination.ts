/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import isFunction from 'd2-utilizr/lib/isFunction';
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

export class EnrollmentCategoryCombination {
    _id = '';
    _displayName = '';
    _categories: Array<EnrollmentCategory> = [];
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

    get displayName(): string {
        return this._displayName;
    }

    set displayName(displayName: string) {
        this._displayName = displayName;
    }

    get categories(): Array<EnrollmentCategory> {
        return this._categories;
    }

    set categories(categories: Array<EnrollmentCategory>) {
        this._categories = categories;
    }

    get categoryOptionCombos(): Array<CategoryOptionCombo> {
        return this._categoryOptionCombos;
    }

    set categoryOptionCombos(categoryOptionCombos: Array<CategoryOptionCombo>) {
        this._categoryOptionCombos = categoryOptionCombos;
    }

    resolveAttributeOptionCombo(categoryOptionUids: ReadonlyArray<string>): string | undefined {
        return resolveAttributeOptionCombo(this._categoryOptionCombos, categoryOptionUids, this._id);
    }
}
