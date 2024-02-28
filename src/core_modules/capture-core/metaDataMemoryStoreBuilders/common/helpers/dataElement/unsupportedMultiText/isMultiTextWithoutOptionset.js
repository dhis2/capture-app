// @flow
import { dataElementTypes } from '../../../../../metaData';

export const isMultiTextWithoutOptionset = (
    valueType: string,
    optionSet?: ?Object,
) => valueType === dataElementTypes.MULTI_TEXT && !optionSet;
