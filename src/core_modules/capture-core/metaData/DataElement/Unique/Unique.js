// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
import scopes from './scopes.const';

type Validator = (value: any, contextProps: any) => Promise<any> | any;

export default class Unique {
    _generatable: boolean;
    _scope: $Values<typeof scopes>;
    _onValidate: Validator;

    constructor(initFn: ?(_this: Unique) => void) {
        this._scope = scopes.ENTIRE_SYSTEM;
        this._generatable = false;
        initFn && initFn(this);
    }

    set generatable(generatable: boolean) {
        this._generatable = generatable;
    }
    get generatable(): boolean {
        return this._generatable;
    }

    set scope(scope: $Values<typeof scopes>) {
        this._scope = scope;
    }
    get scope(): $Values<typeof scopes> {
        return this._scope;
    }

    set onValidate(validator: Validator) {
        this._onValidate = validator;
    }
    get onValidate(): Validator {
        return this._onValidate;
    }
}
