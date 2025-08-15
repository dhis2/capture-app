import type { SaveForEnrollmentAndTeiRegistration } from '../../../../../DataEntries';
import type { TeiPayload } from './TrackedEntityInstance/dataEntryTrackedEntityInstance.types';

export type Props = {
    showDataEntry: boolean;
    programId: string;
    onSaveWithoutEnrollment: (payload: TeiPayload) => void;
    onSaveWithEnrollment: SaveForEnrollmentAndTeiRegistration;
};
