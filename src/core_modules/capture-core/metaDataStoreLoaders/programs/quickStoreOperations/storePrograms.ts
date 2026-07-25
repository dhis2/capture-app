import { FEATURES, featureAvailable } from 'capture-core-utils/featuresSupport';
import { quickStore } from '../../IOUtils';
import { getContext } from '../../context';
import type { CachedProgramStageDataElement } from '../../../storageControllers';
import type { apiProgramsResponse } from './types';

const convert = (() => {
    const sort = (arr: Array<any>, sortBy = 'sortOrder') => {
        arr.sort((a, b) => {
            if (a[sortBy] == null) {
                return b[sortBy] == null ? 0 : 1;
            }

            if (b[sortBy] == null) {
                return -1;
            }

            return a[sortBy] - b[sortBy];
        });
        return arr;
    };

    const convertProgramSections = apiProgramSections =>
        (apiProgramSections || [])
            .map(apiProgramSection => ({
                ...apiProgramSection,
                trackedEntityAttributes: apiProgramSection.trackedEntityAttributes.map(te => te.id),
            }))
            .sort((a, b) => a.sortOrder - b.sortOrder);

    const getProgramStageSections = apiSections => (apiSections ? sort(apiSections) : []);

    const getProgramStageDataElements = (programStageDataElements): Array<CachedProgramStageDataElement> =>
        (programStageDataElements || [])
            .filter(programStageDataElement => programStageDataElement.dataElement?.id)
            .map((programStageDataElement) => {
                const { dataElement, ...passOnProps } = programStageDataElement;
                const cachedProgramStageDataElement = {
                    ...passOnProps,
                    dataElementId: dataElement.id,
                };
                return cachedProgramStageDataElement;
            });

    const getProgramStages = (apiProgramStages) => {
        const programStages = (apiProgramStages || [])
            .map(apiProgramStage => ({
                ...apiProgramStage,
                programStageDataElements: getProgramStageDataElements(apiProgramStage.programStageDataElements),
                programStageSections: getProgramStageSections(apiProgramStage.programStageSections),
            }));
        sort(programStages);
        return programStages;
    };

    const getProgramTrackedEntityAttribute = programAttribute => ({
        ...programAttribute,
        trackedEntityAttribute: undefined,
        trackedEntityAttributeId: programAttribute.trackedEntityAttribute.id,
    });

    const getProgramTrackedEntityAttributes = programAttributes =>
        (programAttributes || [])
            .filter(({ trackedEntityAttribute }) => trackedEntityAttribute?.id)
            .map(programAttribute => getProgramTrackedEntityAttribute(programAttribute));

    return (response: apiProgramsResponse) => {
        const apiPrograms = (response && response.programs) || [];

        return apiPrograms
            .map(apiProgram => ({
                ...apiProgram,
                trackedEntityType: undefined,
                trackedEntityTypeId: apiProgram.trackedEntityType && apiProgram.trackedEntityType.id,
                programStages: getProgramStages(apiProgram.programStages),
                programSections: convertProgramSections(apiProgram.programSections),
                programTrackedEntityAttributes:
                    getProgramTrackedEntityAttributes(apiProgram.programTrackedEntityAttributes),
            }));
    };
})();

const programStageDataElementFields = [
    'compulsory',
    'displayInReports',
    'renderOptionsAsRadio',
    'allowFutureDate',
    'renderType[*]',
    'dataElement[id]',
].join(',');

const programTrackedEntityAttributeFields = [
    'trackedEntityAttribute[id]',
    'displayInList',
    'searchable',
    'mandatory',
    'renderOptionsAsRadio',
    'allowFutureDate',
].join(',');

const baseProgramStageFields = [
    'id',
    'access',
    'autoGenerateEvent',
    'openAfterEnrollment',
    'hideDueDate',
    'allowGenerateNextVisit',
    'remindCompleted',
    'repeatable',
    'generatedByEnrollmentDate',
    'reportDateToUse',
    'blockEntryForm',
    'minDaysFromStart',
    'name',
    'displayName',
    'description',
    'displayExecutionDateLabel',
    'displayDueDateLabel',
    'displayProgramStageLabel',
    'displayEventLabel',
    'formType',
    'featureType',
    'validationStrategy',
    'enableUserAssignment',
    'style',
    'dataEntryForm[id,htmlCode]',
    'programStageSections[id,displayName,displayDescription,sortOrder,dataElements[id]]',
    `programStageDataElements[${programStageDataElementFields}]`,
];

const pluralProgramStageFields = [
    'displayEventsLabel',
];

const baseProgramFields = [
    'id',
    'displayName',
    'displayShortName',
    'programType',
    'style',
    'displayFrontPageList',
    'displayIncidentDateLabel',
    'displayEnrollmentDateLabel',
    'displayEnrollmentLabel',
    'displayFollowUpLabel',
    'displayOrgUnitLabel',
    'displayRelationshipLabel',
    'displayRelationshipsLabel',
    'displayNoteLabel',
    'displayNotesLabel',
    'displayTrackedEntityAttributeLabel',
    'displayTrackedEntityAttributesLabel',
    'displayProgramStageLabel',
    'displayEventLabel',
    'minAttributesRequiredToSearch',
    'useFirstStageDuringRegistration',
    'onlyEnrollOnce',
    'featureType',
    'selectEnrollmentDatesInFuture',
    'selectIncidentDatesInFuture',
    'accessLevel',
    'expiryPeriodType',
    'expiryDays',
    'completeEventsExpiryDays',
    'dataEntryForm[id,htmlCode]',
    'displayIncidentDate',
    'access[data[read,write]]',
    'trackedEntityType[id]',
    'categoryCombo[id,displayName,isDefault,categories[id,displayName]]',
    'programSections[id, displayDescription, displayFormName, sortOrder, trackedEntityAttributes]',
    `programTrackedEntityAttributes[${programTrackedEntityAttributeFields}]`,
];

const pluralProgramFields = [
    'displayEnrollmentsLabel',
    'displayRelationshipsLabel',
    'displayNotesLabel',
    'displayTrackedEntityAttributesLabel',
    'displayProgramStagesLabel',
    'displayEventsLabel',
];

const buildFieldsParam = (includePluralLabels: boolean): string => {
    const stageFields = includePluralLabels
        ? [...baseProgramStageFields, ...pluralProgramStageFields]
        : baseProgramStageFields;
    const programFields = includePluralLabels
        ? [...baseProgramFields, ...pluralProgramFields]
        : baseProgramFields;
    return [
        ...programFields,
        `programStages[${stageFields.join(',')}]`,
    ].join(',');
};

export const storePrograms = (programIds: Array<string>) => {
    const includePluralLabels = featureAvailable(FEATURES.customTerminologyPlurals);
    const query = {
        resource: 'programs',
        params: {
            fields: buildFieldsParam(includePluralLabels),
            filter: `id:in:[${programIds.join(',')}]`,
            pageSize: programIds.length,
        },
    };
    return quickStore({
        query,
        storeName: getContext().storeNames.PROGRAMS,
        convertQueryResponse: convert,
    });
};
