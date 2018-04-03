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
    _optionSets: { [id: string]: OptionSet };
    constructor() {
        this._optionSets = {};
    }

    set(optionSets: Array<OptionSet>) {
        this._optionSets = optionSets.reduce((accObjectOptionSets, optionSet) => {
            accObjectOptionSets[optionSet.id] = optionSet;
            return accObjectOptionSets;
        }, {});
    }

    get() {
        return this._optionSets;
    }
}

export default new OptionSetStore();
