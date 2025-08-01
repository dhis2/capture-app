// @flow
import i18n from '@dhis2/d2-i18n';

export const noValueFilterKeys = {
    IS_EMPTY: 'null',
    IS_NOT_EMPTY: '!null',
};

export const noValueFilterTexts = {
    [noValueFilterKeys.IS_EMPTY]: i18n.t('Is empty'),
    [noValueFilterKeys.IS_NOT_EMPTY]: i18n.t('Is not empty'),
};

export const isNoValueFilter = (value: ?string): boolean =>
    value === noValueFilterKeys.IS_EMPTY || value === noValueFilterKeys.IS_NOT_EMPTY;

export const convertNoValueFilter = (value: string): string => value;
