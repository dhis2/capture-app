// @flow
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { parseHtml } from 'react-html-parser-ultimate';

type Data = {
    scripts: Array<string>,
    elements: Array<React.Node>,
};

/**
 * Stores html as react elements
 *
 * @export
 * @class CustomForm
 */
export class CustomForm {
    _id: string;
    _data: Data;

    constructor(initFn: ?(_this: CustomForm) => void) {
        this._id = '';
        initFn && initFn(this);
    }

    set id(id: string) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
    /**
     * parses html to react elements
     *
     * @memberof CustomForm
     */
    setData(html: string, transformFunction: () => ?React.Element<'FormField'>) {
        this._data = parseHtml(html, {
            onTransform: transformFunction,
            allowScript: true,
        });
    }

    set data(data: Object) {
        this._data = data;
    }

    get data(): Data {
        return this._data;
    }
    /**
     * A callback function for react-html-parser replacing html elements of type input (with certain criteria) with a placeholder FormField React element.
     *
     * @memberof CustomForm
     */
}
