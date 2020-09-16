// @flow
import { isObject, isString } from 'd2-utilizr/src';
import i18n from '@dhis2/d2-i18n';

export const displayFormTypeofValue = (value: any): string => {
    if (isString(value)) {
        return value;
    }
    if (isObject(value)) {
        const me: Object = value;
        return `${i18n.t('from')} ${me.from} ${i18n.t('until')} ${me.to}`;
    }
    return '';
};
