import i18n from '@dhis2/d2-i18n';
import { pipe } from 'capture-core-utils';
import type { BooleanFilterData } from '../../../../../FiltersForTypes';

const textValuesByKey: Record<string, string> = {
    true: i18n.t('Yes'),
    false: i18n.t('No'),
};

const getText = (key: string): string => textValuesByKey[key];

export function convertBoolean(filter: BooleanFilterData): string {
    return pipe(
        (values: any[]) => values.map((value: string) => getText(value)),
        (values: string[]) => values.join(', '),
    )(filter.values);
}
