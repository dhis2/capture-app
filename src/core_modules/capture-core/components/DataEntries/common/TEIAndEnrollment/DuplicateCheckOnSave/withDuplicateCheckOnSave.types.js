// @flow
import type { Node } from 'react';
import type { Enrollment, TeiRegistration } from '../../../../../metaData';
import type { RenderCustomCardActions } from '../../../../CardList';

export type Props = {
    id: string,
    selectedScopeId: string,
    onSave: () => void,
    enrollmentMetadata?: Enrollment,
    teiRegistrationMetadata?: TeiRegistration,
    duplicatesReviewPageSize: number,
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: () => void) => Node,
    skipDuplicateCheck: ?boolean,
};
