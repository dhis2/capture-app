// @flow
import type { Node } from 'react';
import type { TeiRegistration } from '../../../../../../metaData';
import type { RenderCustomCardActions } from '../../../../../CardList';

export type Props = {|
    theme: Theme,
    onSave: () => void,
    teiRegistrationMetadata?: TeiRegistration,
    duplicatesReviewPageSize: number,
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: () => void) => Node,
|};
