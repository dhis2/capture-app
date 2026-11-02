import type { TrackerProgram } from '../../../../metaData';

// Events are created on enrollment by the first stage in the registration form or by auto generated stages
export const createsEventsOnEnrollment = ({ stages, useFirstStageDuringRegistration }: TrackerProgram) =>
    useFirstStageDuringRegistration || [...stages.values()].some(stage => stage.autoGenerateEvent);
