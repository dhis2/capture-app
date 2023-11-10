// @flow
import type { Node } from 'react';
import type { TeiRegistration } from '../../../../../../../metaData';
import type { RenderCustomCardActions } from '../../../../../../CardList';
import type {
    ExistingUniqueValueDialogActionsComponent,
} from '../../../../../../DataEntries';

export type TeiPayload = {|
    trackedEntity: string,
    trackedEntityType: string,
    enrollments: [],
    orgUnit: string,
    geometry: ?{ coordinates: any, type: any },
    attributes: Array<{|
        attribute: string,
        value: any,
    |}>,
|}

export type Props = {|
    theme: Theme,
    trackedEntityTypeId: string,
    onSave: TeiPayload => void,
    teiRegistrationMetadata?: TeiRegistration,
    duplicatesReviewPageSize: number,
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: (TeiPayload) => void) => Node,
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent,
|};
