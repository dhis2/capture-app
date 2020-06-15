// @flow
import { dataElementTypes, OptionSet } from '../../../metaData';

export type CommonQueryData = {
    programId: string,
    orgUnitId: string,
    categories: ?Object,
};

export type Column = {
    id: string,
    header: string,
    visible: boolean,
    type: $Values<typeof dataElementTypes>,
    optionSet?: OptionSet,
    singleSelect?: ?boolean,
};
