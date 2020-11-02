// @flow
import { typeof dataElementTypes } from '../../../metaData';

export type Column = {
    id: string,
    header: string,
    visible: boolean,
    type: $Values<dataElementTypes>,
    optionSet?: Object,
    options?: Object,
    singleSelect?: ?boolean,
};
