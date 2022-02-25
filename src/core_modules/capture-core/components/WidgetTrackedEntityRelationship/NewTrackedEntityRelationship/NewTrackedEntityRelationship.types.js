// @flow

import type { RelationshipType } from '../WidgetTrackedEntityRelationship.types';

export type Props = {|
    renderRef: Object,
    relationshipTypes: Array<RelationshipType>,
    setShowDialog: () => void,
    trackedEntityType: string,
    showDialog: boolean,
    hideDialog: () => void,
    ...CssClasses,
|}
