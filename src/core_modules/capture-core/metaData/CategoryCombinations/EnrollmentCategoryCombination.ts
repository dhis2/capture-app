/* eslint-disable no-underscore-dangle */
import log from 'loglevel';
import isFunction from 'd2-utilizr/lib/isFunction';
import { errorCreator } from 'capture-core-utils';

type CategoryOptionCombo = {
    id: string;
    categoryOptions: Array<{ id: string }>;
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
        if (categoryOptionUids.length === 0) return undefined;

        const target = new Set(categoryOptionUids);
        const matches = this._categoryOptionCombos.filter(coc =>
            coc.categoryOptions.length === categoryOptionUids.length &&
            coc.categoryOptions.every(({ id }) => target.has(id)),
        );

        if (matches.length > 1) {
            log.error(
                errorCreator('Multiple category option combos match the same option set')({
                    enrollmentCategoryComboId: this._id,
                    matches: matches.map(({ id }) => id),
                    categoryOptionUids,
                }),
            );
            return undefined;
        }

        return matches[0]?.id;
    }
}
