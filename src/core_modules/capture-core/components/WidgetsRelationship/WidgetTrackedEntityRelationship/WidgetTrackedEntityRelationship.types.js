// @flow
import type { GetPrograms, GetSearchGroups, GetSearchGroupsAsync } from './NewTrackedEntityRelationship';

type Constraint = {|
    program?: { id: string },
    trackedEntityType?: { id: string },
|}

export type RelationshipType = $ReadOnly<{|
    id: string,
    displayName: string,
    bidirectional: boolean,
    fromToName: string,
    toFromName?: string,
    fromConstraint: Constraint,
    toConstraint: Constraint,
|}>;

export type RelationshipTypes = Array<RelationshipType>;

export type Props = {|
    relationshipTypes?: RelationshipTypes,
    trackedEntityTypeId: string,
    programId: string,
    addRelationshipRenderElement: HTMLElement,
    onOpenAddRelationship?: () => void,
    onCloseAddRelationship?: () => void,
     /*
    Advanced props for metadata, at some point the Widget should work without these
    These are callbacks so we avoid compution before the data is actually needed, the disadvantage is that these will not automatially re-render inner components if there are changes (not needed in our app)
    Obvious workarounds if needed is to add a trigger prop
    We might also want to implement async versions of these (async callbacks should be called from useEffects)
    */
   getPrograms: GetPrograms,
   getSearchGroups?: GetSearchGroups,
   getSearchGroupsAsync?: GetSearchGroupsAsync,
|}

export type RelationshipsForCurrentTEI = {|
    relationshipTypes: Array<RelationshipType>,
    programId: string,
    trackedEntityType: string,
|}
