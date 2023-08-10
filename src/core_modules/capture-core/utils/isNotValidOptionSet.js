// @flow
import { Option, dataElementTypes } from '../metaData';

export const isNotValidOptionSet = (
    valueType: string,
    optionSet?: ?{
        +options: Array<Option>,
    },
) => valueType === dataElementTypes.MULTI_TEXT && (!optionSet || optionSet.options.length === 0);
