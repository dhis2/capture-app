// @flow
import type { Node } from 'react';
import type { Enrollment } from '../../../../../../metaData';
import type { RenderCustomCardActions } from '../../../../../CardList';
import type { SaveForEnrollmentAndTeiRegistration } from '../../../../../DataEntries';

export type Props = {|
    theme: Theme,
    programId: string,
    enrollmentMetadata?: Enrollment,
    onSave: SaveForEnrollmentAndTeiRegistration,
    duplicatesReviewPageSize: number,
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: SaveForEnrollmentAndTeiRegistration) => Node,
|};
