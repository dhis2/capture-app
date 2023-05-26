// @flow
import type { UrlParameters } from '../../../../WidgetsRelationship/common/Types';

export type Props = {|
    trackedEntityTypeId: string,
    teiId: string,
    programId: string,
    onAddRelationship: () => void,
    addRelationshipRenderElement: HTMLDivElement,
    onOpenAddRelationship: () => void,
    onCloseAddRelationship: () => void,
    onLinkedRecordClick: (parameters: UrlParameters) => void,
|};
