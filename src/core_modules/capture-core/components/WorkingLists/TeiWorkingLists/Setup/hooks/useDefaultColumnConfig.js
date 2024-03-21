// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { ADDITIONAL_FILTERS, ADDITIONAL_FILTERS_LABELS } from '../../helpers';
import { dataElementTypes, type TrackerProgram, type DataElement } from '../../../../../metaData';
import type { MainColumnConfig, MetadataColumnConfig, TeiWorkingListsColumnConfigs } from '../../types';

const getMainConfig = (hasDisplayInReportsAttributes: boolean): Array<MainColumnConfig> =>
    [
        {
            id: 'orgUnit',
            visible: false,
            type: dataElementTypes.ORGANISATION_UNIT,
            header: i18n.t('Organisation unit'),
        },
        {
            id: 'createdAt',
            visible: !hasDisplayInReportsAttributes,
            type: dataElementTypes.DATE,
            header: i18n.t('Registration Date'),
            filterHidden: true,
        },
        {
            id: 'inactive',
            visible: false,
            type: dataElementTypes.BOOLEAN,
            header: i18n.t('Inactive'),
            filterHidden: true,
        },
    ].map(field => ({
        ...field,
        mainProperty: true,
    }));

const getProgramStageMainConfig = (programStage): Array<MetadataColumnConfig> =>
    [
        {
            id: ADDITIONAL_FILTERS.status,
            visible: false,
            type: dataElementTypes.TEXT,
            header: i18n.t(ADDITIONAL_FILTERS_LABELS.status),
        },
        {
            id: ADDITIONAL_FILTERS.occurredAt,
            visible: false,
            type: dataElementTypes.DATE,
            header: programStage.stageForm.getLabel('occurredAt') || i18n.t(ADDITIONAL_FILTERS_LABELS.occurredAt),
        },
        ...(programStage.hideDueDate === false
            ? [
                {
                    id: ADDITIONAL_FILTERS.scheduledAt,
                    visible: false,
                    type: dataElementTypes.DATE,
                    header:
                          programStage.stageForm.getLabel('scheduledAt') ||
                          i18n.t(ADDITIONAL_FILTERS_LABELS.scheduledAt),
                },
            ]
            : []),
    ].map(field => ({
        ...field,
        mainProperty: true,
        filterHidden: true,
        additionalColumn: true,
    }));

const getEventsMetaDataConfig = (programStage): Array<MetadataColumnConfig> => {
    const stageForm = programStage.stageForm;
    const dataElements = stageForm ? [...stageForm?.getElements()] : [];
    return getDataValuesMetaDataConfig(dataElements);
};

const getTEIMetaDataConfig = (attributes: Array<DataElement>, orgUnitId: ?string): Array<MetadataColumnConfig> =>
    attributes.map(({ id, displayInReports, type, name, formName, optionSet, searchable, unique }) => ({
        id,
        visible: displayInReports,
        type,
        header: formName || name,
        options: optionSet && optionSet.options.map(({ text, value }) => ({ text, value })),
        multiValueFilter: !!optionSet || type === dataElementTypes.BOOLEAN,
        filterHidden: !(orgUnitId || searchable || unique),
    }));

const getDataValuesMetaDataConfig = (dataElements): Array<MetadataColumnConfig> =>
    dataElements.map(({ id, displayInReports, type, name, formName, optionSet }) => ({
        id,
        visible: displayInReports,
        type,
        header: formName || name,
        options: optionSet && optionSet.options.map(({ text, value }) => ({ text, value })),
        multiValueFilter: !!optionSet,
        additionalColumn: true,
    }));

export const useDefaultColumnConfig = (
    program: TrackerProgram,
    orgUnitId: ?string,
    programStageId: ?string,
): TeiWorkingListsColumnConfigs =>
    useMemo(() => {
        const { attributes, stages } = program;
        const programStage = programStageId && stages.get(programStageId);
        const hasDisplayInReportsAttributes = attributes.some(attribute => attribute.displayInReports);

        const defaultColumns = [
            ...getMainConfig(hasDisplayInReportsAttributes),
            ...getTEIMetaDataConfig(attributes, orgUnitId),
        ];

        if (programStageId && programStage) {
            return defaultColumns.concat([
                ...getProgramStageMainConfig(programStage),
                ...getEventsMetaDataConfig(programStage),
            ]);
        }
        return defaultColumns;
    }, [orgUnitId, program, programStageId]);
