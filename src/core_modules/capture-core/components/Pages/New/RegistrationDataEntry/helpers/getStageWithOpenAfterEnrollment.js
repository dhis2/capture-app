// @flow
import { ProgramStage } from '../../../../../metaData';

export const PAGES = {
    enrollmentEventNew: 'enrollmentEventNew',
    enrollmentEventEdit: 'enrollmentEventEdit',
    enrollmentDashboard: 'enrollmentDashboard',
};

// an event can be created either during first stage registration or autogenerated
// when the event will be created redirect to enrollmentEventEdit
// when the event will not be created redirect to enrollmentEventNew
export const getStageWithOpenAfterEnrollment = (
    stages: Map<string, ProgramStage>,
    useFirstStageDuringRegistration: boolean,
) => {
    const stagesArray = [...stages.values()];
    const [firstStageWithOpenAfterEnrollment] = stagesArray.filter(({ openAfterEnrollment }) => openAfterEnrollment);

    const redirectTo = (() => {
        if (firstStageWithOpenAfterEnrollment) {
            // event will be created during first stage registration
            if (
                useFirstStageDuringRegistration
                && stagesArray[0].id === firstStageWithOpenAfterEnrollment.id
            ) {
                return PAGES.enrollmentEventEdit;
            }
            // event will be autogenerated
            if (
                stagesArray.find(stage => stage.autoGenerateEvent && stage.id === firstStageWithOpenAfterEnrollment.id)
            ) {
                return PAGES.enrollmentEventEdit;
            }
            return PAGES.enrollmentEventNew;
        }
        return PAGES.enrollmentDashboard;
    })();

    return {
        stageWithOpenAfterEnrollment: firstStageWithOpenAfterEnrollment,
        redirectTo,
    };
};
