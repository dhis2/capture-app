export type Props = {
    enrollment: Record<string, any>;
    events: Array<{ status: string; event: string; programStage: string }>;
    programStages: Array<{ name: string; id: string; access: { data: { write: boolean } } }>;
    program: Record<string, unknown>;
    setOpenCompleteModal: (open: boolean) => void;
    onUpdateStatus: (arg: Record<string, any>, redirect?: boolean) => void;
};

export type PlainProps = {
    programStagesWithActiveEvents: { [programId: string]: { name: string; count: number } };
    programStagesWithoutAccess: { [programId: string]: { name: string; count: number } };
    program: Record<string, unknown>;
    setOpenCompleteModal: (open: boolean) => void;
    onCompleteEnrollment: () => void;
    onCompleteEnrollmentAndEvents: () => void;
};
