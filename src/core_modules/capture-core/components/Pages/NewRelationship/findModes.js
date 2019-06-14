// @flow
import i18n from '@dhis2/d2-i18n';

export const findModes = {
    TEI_SEARCH: 'TEI_SEARCH',
    TEI_REGISTER: 'TEI_REGISTER',
};

export const findModeDisplayNames = {
    [findModes.TEI_SEARCH]: i18n.t('Search'),
    [findModes.TEI_REGISTER]: i18n.t('Register'),
};
