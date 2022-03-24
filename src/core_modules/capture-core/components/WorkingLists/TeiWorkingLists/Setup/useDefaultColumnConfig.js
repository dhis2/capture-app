// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    dataElementTypes,
    type TrackerProgram,
    type DataElement,
} from '../../../../metaData';
import type {
    MainColumnConfig,
    MetadataColumnConfig,
    TeiWorkingListsColumnConfigs,
} from '../types';

const mainConfig: Array<MainColumnConfig> = [{
    id: 'orgUnit',
    visible: false,
    type: dataElementTypes.ORGANISATION_UNIT,
    header: i18n.t('Registering unit'),
}, {
    id: 'createdAt',
    visible: false,
    type: dataElementTypes.DATE,
    header: i18n.t('Registration Date'),
    filterHidden: true,
}, {
    id: 'inactive',
    visible: false,
    type: dataElementTypes.BOOLEAN,
    header: i18n.t('Inactive'),
    filterHidden: true,
}]
    .map(field => ({
        ...field,
        mainProperty: true,
    }));

const getMetaDataConfig = (attributes: Array<DataElement>, orgUnitId: ?string): Array<MetadataColumnConfig> =>
    attributes
        .map(({ id, displayInReports, type, name, optionSet, searchable, unique }) => ({
            id,
            visible: displayInReports,
            type,
            header: name,
            options: optionSet && optionSet.options.map(({ text, value }) => ({ text, value })),
            multiValueFilter: !!optionSet,
            filterHidden: !(orgUnitId || (searchable || unique)),
        }));

export const useDefaultColumnConfig = (program: TrackerProgram, orgUnitId: ?string): TeiWorkingListsColumnConfigs =>
    useMemo(() => {
        const { attributes } = program;
        return [
            ...mainConfig,
            ...getMetaDataConfig(attributes, orgUnitId),
        ];
    }, [orgUnitId, program]);
