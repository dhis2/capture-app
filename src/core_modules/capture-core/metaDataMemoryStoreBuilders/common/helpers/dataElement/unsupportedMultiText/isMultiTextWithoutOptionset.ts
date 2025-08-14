import { dataElementTypes } from '../../../../../metaData';

export const isMultiTextWithoutOptionset = (
    valueType: string,
    optionSet?: any,
) => valueType === dataElementTypes.MULTI_TEXT && !optionSet;
