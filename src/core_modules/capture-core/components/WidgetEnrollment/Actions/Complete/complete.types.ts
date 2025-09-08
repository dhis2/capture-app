export type Props = {
    enrollment: Record<string, any>;
    events: Array<{ status: string; event: string; programStage: string }>;
    onUpdate: (arg: Record<string, any>, redirect?: boolean) => void;
    setOpenCompleteModal: (open: boolean) => void;
};
