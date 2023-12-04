// @flow
import type { Node } from 'react';
import type { TeiRegistration } from '../../../../../../../metaData';
import type { RenderCustomCardActions } from '../../../../../../CardList';
import type {
    ExistingUniqueValueDialogActionsComponent,
} from '../../../../../../DataEntries';
import type { InputAttribute } from '../../../../../../DataEntries/EnrollmentRegistrationEntry/hooks/useFormValues';

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
    onCancel: () => void,
    teiRegistrationMetadata?: TeiRegistration,
    inheritedAttributes: Array<InputAttribute>,
    duplicatesReviewPageSize: number,
    renderDuplicatesCardActions?: RenderCustomCardActions,
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave: (TeiPayload) => void) => Node,
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent,
|};
