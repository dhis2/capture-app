// @flow
import { dataElementTypes } from '../../../metaData';

export type Column = {
    id: string,
    header: string,
    visible: boolean,
    type: $Values<typeof dataElementTypes>,
    optionSet?: Object,
    options?: Object,
    singleSelect?: ?boolean,
};
