// @flow
import { useSelector } from 'react-redux';
import runRulesForEnrollmentPage from '../../../rules/actionsCreator/runRulesForEnrollmentPage';


export const useEnrollmentInfo = (enrollmentId: string, programId: string) => {
    const enrollments = useSelector(({ enrollmentPage }) => enrollmentPage.enrollments);
    const tetId = useSelector(({ enrollmentPage }) => enrollmentPage.tetId);
    const programHasEnrollments = enrollments && enrollments.some(({ program }) => programId === program);
    const enrollmentsOnProgramContainEnrollmentId = enrollments && enrollments
        .filter(({ program }) => program === programId)
        .some(({ enrollment }) => enrollmentId === enrollment);

    return { programHasEnrollments, enrollmentsOnProgramContainEnrollmentId, tetId };
};


const extractDataElements = (data) => {
    if (!data?.programData) { return {}; }
    return data.programData.programStages
        .reduce((acc, curr) => {
            curr.programStageDataElements.forEach((stage) => {
                acc[stage.dataElement.id] = { ...stage.dataElement };
            });
            return acc;
        }, {});
};

// $FlowFixMe
export const useRunRulesForEnrollement = (orgUnit, program, programStagesData, teiAttributes) => {
    if (Object.keys(programStagesData ?? {}).length && Object.keys(teiAttributes ?? {}).length) {
        const dataElements = extractDataElements(programStagesData);

        const { attributes, enrollments } = teiAttributes;
        const currentTEIValues = attributes?.map(item => ({ id: item.attribute, valueType: item.valueType }));
        const currentEnrollmentValues = attributes?.reduce((acc, item) => {
            acc[item.attribute] = item.value;
            return acc;
        }, {});
        const rules = runRulesForEnrollmentPage(
            program,
            orgUnit,
            program.stages,
            dataElements,
            { enrollmentDate: enrollments?.[0].enrollmentDate,
                incidentDate: enrollments?.[0].incidentDate,
                enrollmentId: enrollments?.[0].enrollmentId },
            currentEnrollmentValues,
            currentTEIValues,
        );
        return rules;
    }
    return undefined;
};
