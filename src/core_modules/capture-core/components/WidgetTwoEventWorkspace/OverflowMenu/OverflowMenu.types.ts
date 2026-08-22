export type Props = {
    linkedEvent: any;
    relationshipId: string;
    orgUnitId: string;
    originEventId: string;
    stageWriteAccess: boolean;
    relationshipType: string;
    onDeleteEvent?: (eventId: string) => void;
    onDeleteEventRelationship?: (relationshipId: string) => void;
};
