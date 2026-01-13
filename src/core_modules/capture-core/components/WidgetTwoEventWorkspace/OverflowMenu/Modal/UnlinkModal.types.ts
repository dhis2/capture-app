export type Props = {
    setOpenModal: (open: boolean) => void;
    relationshipId: string;
    originEventId: string;
    onDeleteEvent?: (eventId: string) => void;
    onDeleteEventRelationship?: (relationshipId: string) => void;
};
