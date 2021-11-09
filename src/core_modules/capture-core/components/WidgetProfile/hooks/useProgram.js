// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const fields = 'id,version,displayName,displayShortName,description,programType,style,' +
'minAttributesRequiredToSearch,enrollmentDateLabel,incidentDateLabel,' +
'featureType,selectEnrollmentDatesInFuture,selectIncidentDatesInFuture,displayIncidentDate,' +
'dataEntryForm[id,htmlCode],' +
'access[*],' +
'trackedEntityType[id,access,displayName,minAttributesRequiredToSearch,featureType,trackedEntityTypeAttributes[trackedEntityAttribute[id],displayInList,mandatory,searchable],translations[property,locale,value]],' +
'categoryCombo[id,displayName,isDefault,categories[id,displayName]],' +
'userRoles[id,displayName],' +
'programStages[id,access,autoGenerateEvent,openAfterEnrollment,generatedByEnrollmentDate,reportDateToUse,minDaysFromStart,displayName,description,executionDateLabel,formType,featureType,validationStrategy,enableUserAssignment,style,dataEntryForm[id,htmlCode],' +
'programStageSections[id,displayName,displayDescription,sortOrder,dataElements[id]],programStageDataElements[compulsory,displayInReports,renderOptionsAsRadio,allowFutureDate,renderType[*],' +
'dataElement[id,displayName,displayShortName,displayFormName,valueType,translations[*],description,optionSetValue,style,optionSet[id]]]],' +
'programSections[id, displayFormName, sortOrder, trackedEntityAttributes],' +
'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName,displayShortName,displayFormName,description,valueType,optionSetValue,unique,orgunitScope,pattern,translations[property,locale,value],optionSet[id,displayName,version,valueType,options[id,displayName,code,style, translations]]],displayInList,searchable,mandatory,renderOptionsAsRadio,allowFutureDate]';

export const useProgram = (programId: string) => {
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

    return { error, loading, program: !loading && data?.programs };
};
