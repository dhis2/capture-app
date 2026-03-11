import i18n from '@dhis2/d2-i18n';
import { pipe } from 'capture-core-utils';

const textValuesByKey: Record<string, string> = {
    true: i18n.t('Yes'),
    false: i18n.t('No'),
};

const getText = (key: string): string => textValuesByKey[key];

export function convertBoolean(filter: any): string {
    if (filter.isEmpty !== undefined && filter.value) {
        return filter.value;
    }

    return pipe(
        (values: string[]) => values.map(value => getText(value)),
        (values: string[]) => values.join(', '),
    )(filter.values);
}
