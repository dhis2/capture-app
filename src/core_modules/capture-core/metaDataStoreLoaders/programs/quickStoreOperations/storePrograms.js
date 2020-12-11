// @flow
import { quickStore } from '../../IOUtils';
import { getContext } from '../../context';
import type { apiProgramsResponse } from './types';

const convert = (() => {
    const sort = (arr: Array<any>, sortBy: string = 'sortOrder') => {
        arr.sort((a, b) => {
            if (a[sortBy] == null) {
                return 1;
            } if ((b[sortBy] == null)) {
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

    const getOrganisationUnits = apiOrganisationUnits =>
        (apiOrganisationUnits || [])
            .reduce((accOrganisationUnits, organisationUnit) => {
                accOrganisationUnits[organisationUnit.id] = organisationUnit;
                return accOrganisationUnits;
            }, {});

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
                organisationUnits: getOrganisationUnits(apiProgram.organisationUnits),
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
'organisationUnits[id,displayName],' +
'userRoles[id,displayName],' +
'programStages[id,access,displayName,description,executionDateLabel,formType,featureType,validationStrategy,enableUserAssignment,dataEntryForm[id,htmlCode],' +
'programStageSections[id,displayName,sortOrder,dataElements[id]],programStageDataElements[compulsory,displayInReports,renderOptionsAsRadio,allowFutureDate,renderType[*],' +
'dataElement[id,displayName,displayShortName,displayFormName,valueType,translations[*],description,optionSetValue,style,optionSet[id]]]],' +
'programTrackedEntityAttributes[trackedEntityAttribute[id],displayInList,searchable,mandatory,renderOptionsAsRadio,allowFutureDate]';

export const storePrograms = (programIds: Array<string>) => {
    const query = {
        resource: 'programs',
        params: {
            restrictToCaptureScope: true,
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
