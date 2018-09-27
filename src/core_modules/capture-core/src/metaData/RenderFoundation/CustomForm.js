// @flow
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-to-elements-parser';

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
        const data = ReactHtmlParser(html);
        this._data = data;
    }
    get data(): React.Element<any> {
        return this._data;
    }
}
