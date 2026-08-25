import type { OutputEffect } from '@dhis2/rules-engine-javascript';

export type Props = {
    teiId: string;
    programId: string;
    programOwnerId: string;
    readOnlyMode?: boolean;
    ruleEffects?: Array<OutputEffect>;
    onUpdateTeiAttributeValues?: (attributes: Array<{ [key: string]: string }>, teiDisplayName: string) => void;
    onDeleteSuccess?: () => void;
    onStatusToggleSuccess?: () => void;
};
