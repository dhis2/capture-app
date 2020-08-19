// @flow
import React from 'react';
import { dataElementTypes, OptionSet } from '../../../metaData';

export type Column = {
    id: string,
    header: string,
    visible: boolean,
    type: $Values<typeof dataElementTypes>,
    optionSet?: OptionSet,
    singleSelect?: ?boolean,
};

type RowMenuContent = {|
    key: string,
    clickHandler?: ?(rowData: Object) => any,
    element: React$Node,
|};

export type RowMenuContents = Array<RowMenuContent>;