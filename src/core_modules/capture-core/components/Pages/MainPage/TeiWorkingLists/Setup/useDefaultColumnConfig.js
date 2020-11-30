// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    dataElementTypes,
    type TrackerProgram,
    type DataElement,
} from '../../../../../metaData';


export type AnotherDefaultConfig = {
    id: string,
    visible: boolean,
    type: $Values<typeof dataElementTypes>,
    header: string,
    isMainProperty: boolean
}

const getDefaultMainConfig = (): Array<AnotherDefaultConfig> => [{
    id: 'regUnit',
    visible: false,
    type: dataElementTypes.TEXT,
    header: i18n.t('Registering unit'),
}, {
    id: 'regDate',
    visible: false,
    type: dataElementTypes.DATE,
    header: i18n.t('Registration Date'),
}, {
    id: 'inactive',
    visible: false,
    type: dataElementTypes.BOOLEAN,
    header: i18n.t('Inactive'),
}]
    .map(field => ({
        ...field,
        isMainProperty: true,
    }));

export type AnotherColumnConfigurationBase = {
    id: string,
    visible: boolean,
    type: $Values<typeof dataElementTypes>,
    header: string,
    options?: any,
    multiValueFilter: boolean,
};

const getMetaDataConfig =
  (attributes: Array<DataElement>): Array<AnotherColumnConfigurationBase> =>
      attributes
          .map(({ id, displayInReports, type, formName, optionSet }) => ({
              id,
              visible: displayInReports,
              type,
              header: formName,
              options: optionSet && optionSet.options.map(({ text, value }) => ({ text, value })),
              multiValueFilter: !!optionSet,
          }));

export const useDefaultColumnConfig =
  (program: TrackerProgram): Array<AnotherColumnConfigurationBase | AnotherDefaultConfig | {}> =>
      useMemo(() => {
          const { attributes } = program;
          return [
              ...getDefaultMainConfig(),
              ...getMetaDataConfig(attributes),
          ];
      }, [program]);
