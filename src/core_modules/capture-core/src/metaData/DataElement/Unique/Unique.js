// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
import scopes from './scopes.const';

type Validator = (value: any, contextProps: Object) => Promise<any>;

export default class Unique {
    _generatorPattern: ?string;
    _scope: $Values<typeof scopes>;
    _onValidate: ?Validator;

    constructor(initFn: ?(_this: Unique) => void) {
        this._scope = scopes.ENTIRE_SYSTEM;
        initFn && initFn(this);
    }

    set generatorPattern(pattern: string) {
        this._generatorPattern = pattern;
    }
    get generatorPattern(): ?string {
        return this._generatorPattern;
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
    get onValidate(): ?Validator {
        return this._onValidate;
    }
}
