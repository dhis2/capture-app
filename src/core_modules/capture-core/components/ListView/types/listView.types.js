// @flow
import { dataElementTypes, OptionSet } from '../../../metaData';

export type Column = {
    id: string,
    header: string,
    visible: boolean,
    type: $Values<typeof dataElementTypes>,
    optionSet?: OptionSet,
    singleSelect?: ?boolean,
};
