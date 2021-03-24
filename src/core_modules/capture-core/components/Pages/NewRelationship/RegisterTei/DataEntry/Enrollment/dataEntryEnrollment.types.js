// @flow
import type { Node } from 'react';
import type { Enrollment } from '../../../../../../metaData';
import type { RenderCustomCardActions } from '../../../../../CardList';

export type Props = {|
    theme: Theme,
    programId: string,
    enrollmentMetadata?: Enrollment,
    onSave: () => void,
    duplicatesReviewPageSize: number,
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: () => void) => Node,
|};
