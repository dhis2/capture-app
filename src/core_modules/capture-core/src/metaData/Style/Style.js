// @flow
/* eslint-disable no-underscore-dangle */
import isFunction from 'd2-utilizr/src/isFunction';

export default class Style {
    _color: string;
    _icon: ?string;

    constructor(initFn: ?(_this: Style) => void) {
        this.color = 'white';
        initFn && isFunction(initFn) && initFn(this);
    }

    set color(color: string) {
        this._color = color;
    }
    get color(): string {
        return this._color;
    }

    set icon(icon: ?string) {
        this._icon = icon;
    }
    get icon(): ?string {
        return this._icon;
    }
}
