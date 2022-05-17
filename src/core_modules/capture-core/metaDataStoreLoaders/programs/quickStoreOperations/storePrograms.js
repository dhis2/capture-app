// @flow
import { quickStore } from '../../IOUtils';
import { getContext } from '../../context';
import type { apiProgramsResponse } from './types';

const convert = (() => {
    const sort = (arr: Array<any>, sortBy: string = 'sortOrder') => {
        arr.sort((a, b) => {
            if (a[sortBy] === null) {
                return 1;
            } else if ((b[sortBy] === null)) {
                return -1;
            }

            return a[sortBy] - b[sortBy];
        });
        return arr;
    };

    const convertTranslationsToObject = translations =>
        (translations || [])
            .reduce((accTranslationObject, translation) => {
                if (!accTranslationObject[translation.locale]) {
                    accTranslationObject[translation.locale] = {};
                }
                accTranslationObject[translation.locale][translation.property] = translation.value;
                return accTranslationObject;
            }, {});

    const convertProgramSections = apiProgramSections =>
        (apiProgramSections || [])
            .map(apiProgramSection => ({
                ...apiProgramSection,
                trackedEntityAttributes: apiProgramSection.trackedEntityAttributes.map(te => te.id),
            }))
            .sort((a, b) => a.sortOrder - b.sortOrder);

    const getProgramStageSections = apiSections => (apiSections ? sort(apiSections) : []);

    const getProgramStageDataElements = programStageDataElements =>
        (programStageDataElements || [])
            .filter(programStageDataElement => programStageDataElement.dataElement)
            .map((programStageDataElement) => {
                programStageDataElement.dataElement.translations =
                    // $FlowFixMe[incompatible-type] automated comment
                    convertTranslationsToObject(programStageDataElement.dataElement.translations);
                return programStageDataElement;
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
        trackedEntityAttributeId: programAttribute.trackedEntityAttribute && programAttribute.trackedEntityAttribute.id,
    });

    const getProgramTrackedEntityAttributes = programAttributes =>
        (programAttributes || [])
            .map(pa => getProgramTrackedEntityAttribute(pa));

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

const fieldsParam = 'id,version,displayName,displayShortName,description,programType,style,' +
'minAttributesRequiredToSearch,enrollmentDateLabel,incidentDateLabel,' +
'featureType,selectEnrollmentDatesInFuture,selectIncidentDatesInFuture,displayIncidentDate,' +
'dataEntryForm[id,htmlCode],' +
'access[*],' +
'trackedEntityType[id],' +
'categoryCombo[id,displayName,isDefault,categories[id,displayName]],' +
'userRoles[id,displayName],' +
'programStages[id,access,autoGenerateEvent,openAfterEnrollment,repeatable,generatedByEnrollmentDate,reportDateToUse,minDaysFromStart,name,displayName,description,executionDateLabel,dueDateLabel,formType,featureType,validationStrategy,enableUserAssignment,style,dataEntryForm[id,htmlCode]' +
'programStageSections[id,displayName,displayDescription,sortOrder,dataElements[id]],programStageDataElements[compulsory,displayInReports,renderOptionsAsRadio,allowFutureDate,renderType[*],' +
'dataElement[id,displayName,displayShortName,displayFormName,valueType,translations[*],description,url,optionSetValue,style,optionSet[id]]]],' +
'programSections[id, displayFormName, sortOrder, trackedEntityAttributes],' +
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
