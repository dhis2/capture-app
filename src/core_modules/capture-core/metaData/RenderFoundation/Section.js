// @flow
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
import isFunction from 'd2-utilizr/lib/isFunction';
import isDefined from 'd2-utilizr/lib/isDefined';
import type { DataElement } from '../DataElement';

export default class Section {
    static MAIN_SECTION_ID = '#MAIN#';

    static errorMessages = {
        DATA_ELEMENT_NOT_FOUND: 'Data element was not found',
    };

    _id: string;
    _name: string;
    _open: boolean;
    _visible: boolean;
    _collapsible: boolean;
    _elements: Map<string, DataElement>;
    _showContainer: boolean;

    constructor(initFn: (_this: Section) => void) {
        this._visible = true;
        this._open = true;
        this._collapsible = false;
        this._elements = new Map();
        this._showContainer = true;
        initFn && isFunction(initFn) && initFn(this);
    }

    set id(id: string) {
        this._id = id;
    }
    get id(): string {
        return this._id;
    }

    set name(name: string) {
        this._name = name;
    }
    get name(): string {
        return this._name;
    }

    set open(open: ?boolean) {
        // $FlowFixMe[incompatible-type] automated comment
        this._open = isDefined(open) ? open : true;
    }
    get open(): boolean {
        return this._open;
    }

    set visible(visible: ?boolean) {
        // $FlowFixMe[incompatible-type] automated comment
        this._visible = isDefined(visible) ? visible : true;
    }
    get visible(): boolean {
        return this._visible;
    }

    set showContainer(showContainer: ?boolean) {
        // $FlowFixMe[incompatible-type] automated comment
        this._showContainer = isDefined(showContainer) ? showContainer : true;
    }
    get showContainer(): boolean {
        return this._showContainer;
    }

    get elements(): Map<string, DataElement> {
        return this._elements;
    }

    addElement(element: DataElement) {
        if (!this.elements.has(element.id)) {
            this.elements.set(element.id, element);
        }
    }

    * getPropertyNames(): Generator<string, void, void> {
        const excluded = ['getPropertyNames', 'constructor', 'copyPropertiesTo'];

        for (const name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            if (!excluded.includes(name)) {
                yield name;
            }
        }
    }

    copyPropertiesTo(object: {}) {
        for (const propName of this.getPropertyNames()) {
            // $FlowFixMe[prop-missing] automated comment
            object[propName] = this[propName];
        }
        return object;
    }
}
