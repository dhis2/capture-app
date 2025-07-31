export type PlainProps = {
    showEditEvent?: boolean;
    eventId: string;
    eventData: any;
    onOpenEditEvent: (orgUnit: any, programCategory?: any) => void;
    programStage: any;
    eventAccess: { read: boolean, write: boolean };
    programId: string;
    onBackToAllEvents: () => void;
};
