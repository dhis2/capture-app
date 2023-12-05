// @flow
import type { Node } from 'react';
import type { TeiRegistration } from '../../../../../../metaData';
import type { RenderCustomCardActions } from '../../../../../CardList';
import type {
    ExistingUniqueValueDialogActionsComponent,
} from '../../../../../DataEntries';
import type {
    TeiPayload,
} from '../../../../common/TEIRelationshipsWidget/RegisterTei/DataEntry/TrackedEntityInstance/dataEntryTrackedEntityInstance.types';

export type Props = {|
    theme: Theme,
    onSave: (TeiPayload) => void,
    onCancel: () => void,
    teiRegistrationMetadata?: TeiRegistration,
    duplicatesReviewPageSize: number,
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: (TeiPayload) => void) => Node,
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent,
|};
