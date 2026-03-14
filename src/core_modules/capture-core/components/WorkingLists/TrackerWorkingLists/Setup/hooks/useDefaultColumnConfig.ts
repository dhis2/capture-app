import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { ADDITIONAL_FILTERS, ADDITIONAL_FILTERS_LABELS } from '../../helpers';
import { dataElementTypes, type TrackerProgram } from '../../../../../metaData';
import type { MainColumnConfig, MetadataColumnConfig, TrackerWorkingListsColumnConfigs } from '../../types';

const rangeToBaseType: Record<string, string> = {
    [dataElementTypes.NUMBER_RANGE]: dataElementTypes.NUMBER,
    [dataElementTypes.INTEGER_RANGE]: dataElementTypes.INTEGER,
    [dataElementTypes.INTEGER_POSITIVE_RANGE]: dataElementTypes.INTEGER_POSITIVE,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: dataElementTypes.INTEGER_ZERO_OR_POSITIVE,
    [dataElementTypes.INTEGER_NEGATIVE_RANGE]: dataElementTypes.INTEGER_NEGATIVE,
    [dataElementTypes.DATE_RANGE]: dataElementTypes.DATE,
    [dataElementTypes.DATETIME_RANGE]: dataElementTypes.DATETIME,
    [dataElementTypes.TIME_RANGE]: dataElementTypes.TIME,
    // TODO: Uncomment this when DHIS2-12881 is merged
    // [dataElementTypes.PERCENTAGE_RANGE]: dataElementTypes.PERCENTAGE,
};

const getBaseType = (type: string): string => rangeToBaseType[type] ?? type;

const getMainConfig = (hasDisplayInReportsAttributes: boolean): Array<MainColumnConfig> =>
    [
        {
            id: 'programOwnerId',
            visible: false,
            type: dataElementTypes.ORGANISATION_UNIT,
            header: i18n.t('Owner organisation unit'),
            sortDisabled: true,
            apiViewName: 'programOwner',
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
            visible: true,
            type: dataElementTypes.TEXT,
            header: i18n.t(ADDITIONAL_FILTERS_LABELS.status),
        },
        {
            id: ADDITIONAL_FILTERS.occurredAt,
            visible: true,
            type: dataElementTypes.DATE,
            header: programStage.stageForm.getLabel('occurredAt') || i18n.t(ADDITIONAL_FILTERS_LABELS.occurredAt),
        },
        ...(programStage.hideDueDate === false
            ? [
                {
                    id: ADDITIONAL_FILTERS.scheduledAt,
                    visible: true,
                    type: dataElementTypes.DATE,
                    header:
                        programStage.stageForm.getLabel('scheduledAt') ||
                        i18n.t(ADDITIONAL_FILTERS_LABELS.scheduledAt),
                },
            ]
            : []),
        {
            id: ADDITIONAL_FILTERS.orgUnit,
            visible: true,
            type: dataElementTypes.ORGANISATION_UNIT,
            header: ADDITIONAL_FILTERS_LABELS.orgUnit,
            apiViewName: 'eventOrgUnit',
        },
        ...(programStage.enableUserAssignment
            ? [
                {
                    id: ADDITIONAL_FILTERS.assignedUser,
                    visible: true,
                    type: dataElementTypes.ASSIGNEE,
                    header: i18n.t(ADDITIONAL_FILTERS_LABELS.assignee),
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTEIMetaDataConfig = (attributes: Array<any>, orgUnitId: string | null | undefined): Array<MetadataColumnConfig> =>
    attributes.map(({
        id,
        displayInReports,
        type: searchType,
        name,
        formName,
        optionSet,
        searchable,
        unique,
        searchOperator,
        minCharactersToSearch }) => {
        const type = getBaseType(searchType) as typeof dataElementTypes[keyof typeof dataElementTypes];
        return {
            id,
            visible: displayInReports,
            type,
            header: formName || name,
            options: optionSet && optionSet.options.map(({ text, value }) => ({ text, value })),
            multiValueFilter: !!optionSet || type === dataElementTypes.BOOLEAN,
            filterHidden: !(orgUnitId || searchable || unique),
            unique: Boolean(unique),
            searchOperator,
            minCharactersToSearch,
        };
    });

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
    orgUnitId: string | null | undefined,
    programStageId: string | null | undefined,
): TrackerWorkingListsColumnConfigs =>
    useMemo(() => {
        const { stages } = program;
        const attributes = program.searchGroups.flatMap(group => group.searchForm.getElements());
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
