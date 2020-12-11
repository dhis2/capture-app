// @flow
import i18n from '@dhis2/d2-i18n';

export const modeKeys = {
  CURRENT: 'CURRENT',
  ANY: 'ANY',
  NONE: 'NONE',
  PROVIDED: 'PROVIDED',
};

export function getModeOptions() {
  return [
    {
      name: i18n.t('Me'),
      value: modeKeys.CURRENT,
    },
    {
      name: i18n.t('Anyone'),
      value: modeKeys.ANY,
    },
    {
      name: i18n.t('None'),
      value: modeKeys.NONE,
    },
    {
      name: i18n.t('Select user'),
      value: modeKeys.PROVIDED,
    },
  ];
}
