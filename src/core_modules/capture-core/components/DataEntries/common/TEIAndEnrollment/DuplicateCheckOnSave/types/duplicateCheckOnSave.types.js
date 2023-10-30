// @flow
import type { EnrollmentPayload } from '../../../../EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.types';
import type { TeiPayload } from '../../../../../Pages/common/TEIRelationshipsWidget/RegisterTei/DataEntry/TrackedEntityInstance/dataEntryTrackedEntityInstance.types';

export type SaveForDuplicateCheck = (
    teiWithEnrollment: EnrollmentPayload | TeiPayload,
) => void;
