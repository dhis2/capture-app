import i18n from '@dhis2/d2-i18n';
import { colors, spacers } from '@dhis2/ui';
import { searchOperators } from '../metaDataMemoryStoreBuilders';

export const searchOperatorHelpTexts = {
    [searchOperators.EQ]: i18n.t('Exact matches only'),
    [searchOperators.SW]: i18n.t('Must match the start of the value'),
    [searchOperators.EW]: i18n.t('Must match the end of the value'),
};

export const helpTextStyle = {
    marginTop: spacers.dp4,
    marginInline: 0,
    marginBottom: 0,
    fontSize: 12,
    lineHeight: '14px',
    color: colors.grey700,
};
