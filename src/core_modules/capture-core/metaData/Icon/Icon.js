// @flow
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/lib/isFunction';

export default class Icon {
    _color: string;
    _data: string;

    constructor(initFn: ?(_this: Icon) => void) {
        this.color = 'white';
        initFn && isFunction(initFn) && initFn(this);
    }

    set color(color: string) {
        this._color = color;
    }
    get color(): string {
        return this._color;
    }

    set data(data: string) {
        this._data = data;
    }
    get data(): string {
        return this._data;
    }
}
