export type Props = {
    tetName: string;
    canAddNew: boolean;
    onlyEnrollOnce: boolean;
    program: Record<string, unknown>;
    onAddNew: (arg: Record<string, any>) => void;
};
