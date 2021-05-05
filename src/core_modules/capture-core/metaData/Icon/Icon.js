// @flow
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/lib/isFunction';

export class Icon {
    _color: string | void;
    _name: string | void;

    constructor(initFn: ?(_this: Icon) => void) {
        this.color = 'white';
        initFn && isFunction(initFn) && initFn(this);
    }

    set color(color?: string) {
        this._color = color;
    }
    get color(): string | void {
        return this._color;
    }

    set name(name?: string) {
        this._name = name;
    }
    get name(): string | void {
        return this._name;
    }

    clone() {
        return new Icon((cloneObject) => {
            Object
                .getOwnPropertyNames(this)
                .forEach((propName) => {
                    // $FlowFixMe
                    cloneObject[propName] = this[propName];
                });
        });
    }
}
