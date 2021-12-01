// @flow
import type { Node } from 'react';
import type { SaveForEnrollmentAndTeiRegistration } from '../../../../../DataEntries';
import type { RenderCustomCardActions } from '../../../../../CardList';
import type { Enrollment } from '../../../../../../metaData';

export type Props = {|
    theme: Theme,
    programId: string,
    enrollmentMetadata?: Enrollment,
    onSave: SaveForEnrollmentAndTeiRegistration,
    duplicatesReviewPageSize: number,
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: SaveForEnrollmentAndTeiRegistration) => Node,
|};
