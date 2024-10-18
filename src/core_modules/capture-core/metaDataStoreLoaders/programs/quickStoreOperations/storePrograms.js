// @flow
import { quickStore } from '../../IOUtils';
import { getContext } from '../../context';
import type { CachedProgramStageDataElement } from '../../../storageControllers';
import type { apiProgramsResponse } from './types';

const convert = (() => {
    const sort = (arr: Array<any>, sortBy: string = 'sortOrder') => {
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

const fieldsParam = 'id,displayName,displayShortName,description,programType,style,displayFrontPageList,useFirstStageDuringRegistration,onlyEnrollOnce,' +
'displayIncidentDateLabel,displayEnrollmentDateLabel,minAttributesRequiredToSearch,' +
'featureType,selectEnrollmentDatesInFuture,selectIncidentDatesInFuture,displayIncidentDate,' +
'dataEntryForm[id,htmlCode],' +
'access[*],' +
'trackedEntityType[id],' +
'categoryCombo[id,displayName,isDefault,categories[id,displayName]],' +
'userRoles[id,displayName],' +
// eslint-disable-next-line max-len
'programStages[id,access,autoGenerateEvent,openAfterEnrollment,hideDueDate,allowGenerateNextVisit,remindCompleted,repeatable,generatedByEnrollmentDate,reportDateToUse,blockEntryForm,minDaysFromStart,name,displayName,description,displayExecutionDateLabel,displayDueDateLabel,formType,featureType,validationStrategy,enableUserAssignment,style,dataEntryForm[id,htmlCode]' +
'programStageSections[id,displayName,displayDescription,sortOrder,dataElements[id]],' +
// eslint-disable-next-line max-len
'programStageDataElements[compulsory,displayInReports,renderOptionsAsRadio,allowFutureDate,renderType[*],dataElement[id]]]' +
'programSections[id, displayDescription, displayFormName, sortOrder, trackedEntityAttributes],' +
// eslint-disable-next-line max-len
'programTrackedEntityAttributes[trackedEntityAttribute[id],displayInList,searchable,mandatory,renderOptionsAsRadio,allowFutureDate]';

export const storePrograms = (programIds: Array<string>) => {
    const query = {
        resource: 'programs',
        params: {
            fields: fieldsParam,
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
