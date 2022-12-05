import { useDataQuery } from '@dhis2/app-runtime';

export const useProgramMetadata = (programId: string): any => {
    const {
        data,
        error,
        loading,
    } = useDataQuery({
        programData: {
            resource: 'programs',
            id: programId,
            params: {
                fields: ['programStages[id,repeatable,hideDueDate,programStageDataElements[displayInReports,dataElement[id,valueType,displayName,optionSet[options[code,name]]]'],
            },
        },
    });
    return {
        error,
        programMetadata: !loading && data && data.programData ? data.programData : undefined,
    };
};
