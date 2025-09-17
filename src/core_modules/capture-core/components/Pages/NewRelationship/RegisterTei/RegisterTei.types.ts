import type { EnrollmentPayload } from
    '../../../DataEntries/EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.types';
import type { TeiPayload } from
    '../../common/TEIRelationshipsWidget/RegisterTei/DataEntry/TrackedEntityInstance/dataEntryTrackedEntityInstance.types';

type PropsFromRedux = {
    dataEntryId: string;
    itemId: string;
    trackedEntityName?: string | null;
    trackedEntityTypeId?: string | null;
    newRelationshipProgramId: string;
    error: string;
};

export type OwnProps = {
    onLink: (teiId: string, values: Record<string, unknown>) => void;
    onCancel: () => void;
    onGetUnsavedAttributeValues?: (() => Record<string, unknown>) | null;
    onSave: (itemId: string, dataEntryId: string, payload: EnrollmentPayload | TeiPayload) => void;
};

export type PlainProps = PropsFromRedux & OwnProps;
