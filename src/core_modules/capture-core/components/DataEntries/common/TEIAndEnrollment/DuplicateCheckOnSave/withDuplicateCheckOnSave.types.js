// @flow
import type { Node } from 'react';
import type { Enrollment, TeiRegistration } from '../../../../../metaData';
import type { RenderCustomCardActions } from '../../../../CardList';
import type { SaveForDuplicateCheck } from './types';

export type Props = {
    id: string,
    selectedScopeId: string,
    onSave: SaveForDuplicateCheck,
    enrollmentMetadata?: Enrollment,
    teiRegistrationMetadata?: TeiRegistration,
    duplicatesReviewPageSize: number,
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: SaveForDuplicateCheck) => Node,
    skipDuplicateCheck: ?boolean,
};
