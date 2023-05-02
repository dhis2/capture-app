// @flow

import type { Url } from '../../../../../utils/url';

export type Props = {|
    trackedEntityTypeId: string,
    teiId: string,
    programId: string,
    onAddRelationship: () => void,
    addRelationshipRenderElement: HTMLDivElement,
    onOpenAddRelationship: () => void,
    onCloseAddRelationship: () => void,
    onLinkedRecordClick: (parameters: Url) => void,
|};
