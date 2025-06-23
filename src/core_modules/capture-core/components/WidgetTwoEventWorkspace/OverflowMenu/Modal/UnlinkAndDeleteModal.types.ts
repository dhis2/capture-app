export type Props = {
    setOpenModal: (open: boolean) => void;
    eventId: string;
    originEventId: string;
    relationshipId: string;
    onDeleteEvent?: (eventId: string) => void;
    onDeleteEventRelationship?: (relationshipId: string) => void;
};
