// @flow
/* eslint-disable no-underscore-dangle */
import { type Node, type Element } from 'react';
import { parseHtml } from 'react-html-parser-ultimate';

type Data = {
    scripts: Array<string>,
    elements: Array<Node>,
};

type TransformFunction = (node: Object, index: number, nodeToElementFn: (node: Object, index: number)
    => Element<'FormField'>)
    => void | Element<'FormField'>;

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
    get id(): string {
        return this._id;
    }
    /**
     * parses html to react elements
     *
     * @memberof CustomForm
     */
    setData(html: string, transformFunction: TransformFunction) {
        this._data = parseHtml(html, {
            onTransform: transformFunction,
            allowScript: true,
        });
    }

    get data(): Data {
        return this._data;
    }
}
