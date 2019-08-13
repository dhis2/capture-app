// @flow
/* eslint-disable no-underscore-dangle */

type Constant = {
    id: string,
    displayName: string,
    value: any,
};

class ConstantStore {
    _constants: ?Array<Constant>;

    set(constants: Array<Constant>) {
        this._constants = constants;
    }

    get() {
        return this._constants;
    }
}

export default new ConstantStore();
