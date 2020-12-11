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

    /**
     * parses html to react elements
     *
     * @memberof CustomForm
     */
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
    /**
     * A callback function for react-html-parser replacing html elements of type input (with certain criteria) with a placeholder FormField React element.
     *
     * @memberof CustomForm
     */

    // $FlowFixMe[missing-annot] automated comment
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
