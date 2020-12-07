// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    dataElementTypes,
    type TrackerProgram,
    type DataElement,
} from '../../../../../metaData';
import type {
    MainColumnConfig,
    MetadataColumnConfig,
    TeiWorkingListsColumnConfigs,
} from '../types';

const getDefaultMainConfig = (): Array<MainColumnConfig> => [{
    id: 'regUnit',
    visible: false,
    type: dataElementTypes.ORGANISATION_UNIT,
    header: i18n.t('Registering unit'),
    apiName: 'orgUnit',
}, {
    id: 'regDate',
    visible: false,
    type: dataElementTypes.DATE,
    header: i18n.t('Registration Date'),
    apiName: 'created',
    disableFilter: true,
}, {
    id: 'inactive',
    visible: false,
    type: dataElementTypes.BOOLEAN,
    header: i18n.t('Inactive'),
    disableFilter: true,
}]
    .map(field => ({
        ...field,
        mainProperty: true,
    }));

const getMetaDataConfig = (attributes: Array<DataElement>): Array<MetadataColumnConfig> =>
    attributes
        .map(({ id, displayInReports, type, formName, optionSet }) => ({
            id,
            visible: displayInReports,
            type,
            header: formName,
            options: optionSet && optionSet.options.map(({ text, value }) => ({ text, value })),
            multiValueFilter: !!optionSet,
        }));

export const useDefaultColumnConfig = (program: TrackerProgram): TeiWorkingListsColumnConfigs =>
    useMemo(() => {
        const { attributes } = program;
        return [
            ...getMetaDataConfig(attributes),
            ...getDefaultMainConfig(),
        ];
    }, [program]);
