// @flow
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { parseHtml, convertNodeToElement } from 'react-html-parser-ultimate';

export default class CustomForm {
    _id: string;
    _data: React.Element<any>;

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

    set data(html: string) {
        const data = parseHtml(html, {
            transform: this.transformNode,
            isScriptAllowed: true,
        });
        this._data = data;
    }
    get data(): React.Element<any> {
        return this._data;
    }

    transformNode = (node: Object) => {
        if (node.name === 'input') {
            const customId = node.attribs && node.attribs.id;
            const matchResult = customId && /-[^-]+/.exec(customId);
            if (matchResult) {
                const id = matchResult[0].replace('-', '');
                return React.createElement('FormField', {
                    id,
                });
            }
        }
        return undefined;
    }
}
