import type { ReactNode } from 'react';
import type { Theme } from '@material-ui/core/styles';
import type { TeiRegistration } from '../../../../../../metaData';
import type { RenderCustomCardActions } from '../../../../../CardList';
import type {
    ExistingUniqueValueDialogActionsComponent,
} from '../../../../../DataEntries';
import type {
    TeiPayload,
} from '../../../../common/TEIRelationshipsWidget/RegisterTei/DataEntry/TrackedEntityInstance/dataEntryTrackedEntityInstance.types';

export type Props = {
    theme: Theme;
    onSave: (payload: TeiPayload) => void;
    onCancel: () => void;
    teiRegistrationMetadata?: TeiRegistration | any;
    duplicatesReviewPageSize: number;
    renderDuplicatesCardActions?: RenderCustomCardActions;
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: (payload: TeiPayload) => void) => ReactNode;
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent;
};
