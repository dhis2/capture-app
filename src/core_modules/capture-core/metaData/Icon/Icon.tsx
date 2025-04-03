/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/lib/isFunction';

export class Icon {
    _color?: string;
    _name?: string;

    constructor(initFn: ((self: Icon) => void) | undefined) {
        this.color = 'white';
        initFn && isFunction(initFn) && initFn(this);
    }

    set color(color: string | undefined) {
        this._color = color;
    }
    get color(): string | undefined {
        return this._color;
    }

    set name(name: string | undefined) {
        this._name = name;
    }
    get name(): string | undefined {
        return this._name;
    }

    clone(): Icon {
        return new Icon((cloneObject) => {
            Object
                .getOwnPropertyNames(this)
                .forEach((propName) => {
                    cloneObject[propName] = this[propName];
                });
        });
    }
}
