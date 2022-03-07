// @flow
import type { Node } from 'react';
import type { TeiRegistration } from '../../../../../../metaData';
import type { RenderCustomCardActions } from '../../../../../CardList';
import type {
    SaveForEnrollmentAndTeiRegistration,
    ExistingUniqueValueDialogActionsComponent,
} from '../../../../../DataEntries';

export type Props = {|
    theme: Theme,
    onSave: SaveForEnrollmentAndTeiRegistration,
    teiRegistrationMetadata?: TeiRegistration,
    duplicatesReviewPageSize: number,
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: SaveForEnrollmentAndTeiRegistration) => Node,
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent,
|};
