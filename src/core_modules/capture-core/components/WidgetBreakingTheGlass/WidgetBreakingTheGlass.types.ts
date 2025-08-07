export type Props = {
    programId: string;
    teiId: string;
    onBreakingTheGlass: (reason?: string) => void;
    onCancel: () => void;
};

export type PlainProps = {
    onBreakingTheGlass: (reason?: string) => void;
    onCancel: () => void;
};
