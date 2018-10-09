// @flow
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { parseHtml } from 'react-html-parser-ultimate';

type Data = {
    scripts: Array<string>,
    elements: Array<React.Node>,
};

export default class CustomForm {
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

    set data(html: string) {
        const data = parseHtml(html, {
            onTransform: this.transformNode,
            allowScript: true,
        });
        this._data = data;
    }
    get data(): Data {
        return this._data;
    }

    transformNode = (node: Object, index: number, nodeToElementFn) => {
        if (node.name === 'input') {
            const htmlElementId = node.attribs && node.attribs.id;
            const matchResult = htmlElementId && /-[^-]+/.exec(htmlElementId);
            if (matchResult) {
                const id = matchResult[0].replace('-', '');
                const inputElement = nodeToElementFn(node, index);

                const style = inputElement.props && inputElement.props.style;
                const className = inputElement.props && inputElement.props.className;

                const customFormElementProps = {
                    id: htmlElementId,
                    style,
                    className,
                };

                return React.createElement(
                    'FormField', {
                        customFormElementProps,
                        id,
                    },
                );
            }
        }
        return undefined;
    }
}
