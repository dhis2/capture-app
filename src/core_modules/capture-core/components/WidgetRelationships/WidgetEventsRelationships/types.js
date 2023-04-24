// @flow

import type { InputRelationship, RelationshipType } from '../common.types';

export type Props = {|
    eventId: string,
    relationships: Array<InputRelationship>,
    relationshipTypes: Array<RelationshipType>,
    onAddRelationship: () => void
|}
