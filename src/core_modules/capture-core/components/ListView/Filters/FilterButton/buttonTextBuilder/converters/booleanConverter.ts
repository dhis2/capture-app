import i18n from '@dhis2/d2-i18n';
import type { BooleanFilterData } from '../../../../../FiltersForTypes';

const textValuesByKey: Record<string, string> = {
    true: i18n.t('Yes'),
    false: i18n.t('No'),
};

const getText = (key: string): string => textValuesByKey[key];

export function convertBoolean(filter: BooleanFilterData): string {
    const values = filter.values as unknown as string[];
    return values.map((value: string) => getText(value)).join(', ');
}
