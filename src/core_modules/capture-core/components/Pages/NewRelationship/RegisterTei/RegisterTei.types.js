// @flow
import type { EnrollmentPayload } from
    '../../../DataEntries/EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.types';
import type { TeiPayload } from
    '../../common/TEIRelationshipsWidget/RegisterTei/DataEntry/TrackedEntityInstance/dataEntryTrackedEntityInstance.types';

type PropsFromRedux = {|
    dataEntryId: string,
    itemId: string,
    trackedEntityName: ?string,
    trackedEntityTypeId: ?string,
    newRelationshipProgramId: string,
    error: string,
|};

export type OwnProps = {|
    onLink: (teiId: string, values: Object) => void,
    onCancel: () => void,
    onGetUnsavedAttributeValues?: ?Function,
    onSave: (itemId: string, dataEntryId: string, payload: EnrollmentPayload | TeiPayload) => void,
|};

export type Props = {|...PropsFromRedux, ...OwnProps, ...CssClasses |}
