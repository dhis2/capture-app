/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
import { scopes } from './scopes.const';
import type { QuerySingleResource } from '../../../utils/api/api.types';

type Validator = (value: any, contextProps: any, querySingleResource: QuerySingleResource) => Promise<any> | any;

export class Unique {
    _generatable!: boolean;
    _scope!: string;
    _onValidate!: Validator;

    constructor(initFn?: (_this: Unique) => void) {
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

    set scope(scope: string) {
        this._scope = scope;
    }
    get scope(): string {
        return this._scope;
    }

    set onValidate(validator: Validator) {
        this._onValidate = validator;
    }
    get onValidate(): Validator {
        return this._onValidate;
    }
}
