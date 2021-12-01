// @flow
import type { Node } from 'react';
import type { SaveForEnrollmentAndTeiRegistration } from '../../../../../DataEntries';
import type { RenderCustomCardActions } from '../../../../../CardList';
import type { TeiRegistration } from '../../../../../../metaData';

export type Props = {|
    theme: Theme,
    onSave: SaveForEnrollmentAndTeiRegistration,
    teiRegistrationMetadata?: TeiRegistration,
    duplicatesReviewPageSize: number,
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: SaveForEnrollmentAndTeiRegistration) => Node,
|};
