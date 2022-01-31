// @flow

import type { RelationshipType } from '../WidgetTrackedEntityRelationship.types';

export type Props = {|
    renderRef: Object,
    relationshipTypes: Array<RelationshipType>,
    trackedEntityType: string,
    showDialog: boolean,
    hideDialog: () => void,
    ...CssClasses,
|}
