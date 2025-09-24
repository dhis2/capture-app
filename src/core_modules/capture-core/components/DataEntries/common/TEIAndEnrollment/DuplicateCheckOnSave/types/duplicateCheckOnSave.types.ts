import type { EnrollmentPayload } from '../../../../EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.types';
import type { TeiPayload } from
    '../../../../../Pages/common/TEIRelationshipsWidget/RegisterTei/DataEntry/TrackedEntityInstance';

export type SaveForDuplicateCheck = (
    teiWithEnrollment: EnrollmentPayload | TeiPayload,
    redirect: {
        programStageId?: string;
        eventId?: string;
    },
) => void;
