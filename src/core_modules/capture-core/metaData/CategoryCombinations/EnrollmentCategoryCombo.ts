/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/lib/isFunction';

export type CategoryOptionCombo = {
    id: string;
    categoryOptions: Array<{ id: string }>;
};

export class EnrollmentCategoryCombo {
    _id!: string;
    _categoryOptionCombos!: Array<CategoryOptionCombo>;

    constructor(initFn: ((_this: EnrollmentCategoryCombo) => void) | null) {
        this.id = '';
        this.categoryOptionCombos = [];
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
}
