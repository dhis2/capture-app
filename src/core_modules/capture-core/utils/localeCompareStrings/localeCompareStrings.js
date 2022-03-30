// @flow
import i18n from '@dhis2/d2-i18n';

export const localeCompareStrings = (a: string, b: string) => a.localeCompare(b, i18n.language);
