// @flow
import type { InputRelationship, RelationshipType } from '../common.types';

export type Props = {|
    relationships: Array<InputRelationship>,
    relationshipTypes: Array<RelationshipType>,
    onAddRelationship: () => void,
    teiId: string,
    ...CssClasses,
|};
