// @flow
import i18n from '@dhis2/d2-i18n';
import { pipe } from 'capture-core-utils';
import type { BooleanFilterData } from '../../../../../FiltersForTypes';

const getText = (key: boolean) => (key ? i18n.t('Yes') : i18n.t('No'));

export function convertBoolean(filter: BooleanFilterData): string {
  return pipe(
    (values) => values.map((value) => getText(value)),
    (values) => values.join(', '),
  )(filter.values);
}
