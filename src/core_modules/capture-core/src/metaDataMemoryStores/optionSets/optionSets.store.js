// @flow
/* eslint-disable no-underscore-dangle */

type Option = {
    code: string,
    displayName: string,
    id: string,
};

export type OptionSet = {
    id: string,
    displayName: string,
    options: Array<Option>,
};

class OptionSetStore {
    _optionSets: ?Array<OptionSet>;

    set(optionSets: Array<OptionSet>) {
        this._optionSets = optionSets;
    }

    get() {
        return this._optionSets;
    }
}

export default new OptionSetStore();
