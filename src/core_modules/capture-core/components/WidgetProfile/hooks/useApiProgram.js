// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const fields =
    'id,version,displayName,displayShortName,description,programType,style,minAttributesRequiredToSearch,enrollmentDateLabel,incidentDateLabel,featureType,selectEnrollmentDatesInFuture,selectIncidentDatesInFuture,displayIncidentDate,' +
    'access[*],' +
    'dataEntryForm[id,htmlCode],' +
    'categoryCombo[id,displayName,isDefault,categories[id,displayName]],' +
    'programIndicators[id,displayName,code,shortName,style,displayInForm,expression,displayDescription,description,filter,program[id]],' +
    'programSections[id,displayFormName,displayDescription,sortOrder,trackedEntityAttributes],' +
    'programRuleVariables[id,displayName,programRuleVariableSourceType,valueType,program[id],programStage[id],dataElement[id],trackedEntityAttribute[id],useCodeForOptionSet],' +
    'programStages[id,access,autoGenerateEvent,openAfterEnrollment,generatedByEnrollmentDate,reportDateToUse,minDaysFromStart,displayName,description,executionDateLabel,formType,featureType,validationStrategy,enableUserAssignment,style,' +
        'dataEntryForm[id,htmlCode],' +
        'programStageSections[id,displayName,displayDescription,sortOrder,dataElements[id]],' +
        'programStageDataElements[compulsory,displayInReports,renderOptionsAsRadio,allowFutureDate,renderType[*],dataElement[id,displayName,displayShortName,displayFormName,valueType,translations[*],description,optionSetValue,style,optionSet[id,displayName,version,valueType,options[id,displayName,code,style, translations]]]]' +
    '],' +
    'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName,displayShortName,displayFormName,description,valueType,optionSetValue,unique,orgunitScope,pattern,translations[property,locale,value],optionSet[id,displayName,version,valueType,options[id,displayName,name,code,style,translations]]],displayInList,searchable,mandatory,renderOptionsAsRadio,allowFutureDate],' +
    'trackedEntityType[id,access,displayName,allowAuditLog,minAttributesRequiredToSearch,featureType,trackedEntityTypeAttributes[trackedEntityAttribute[id],displayInList,mandatory,searchable],translations[property,locale,value]],' +
    'userRoles[id,displayName]';

export const useApiProgram = (programId: string) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                programs: {
                    resource: 'programs',
                    id: programId,
                    params: {
                        fields,
                    },
                },
            }),
            [programId],
        ),
    );

    return { error, loading, program: data?.programs };
};
