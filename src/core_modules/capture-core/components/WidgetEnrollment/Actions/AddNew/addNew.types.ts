export type Props = {
    tetName: string;
    canAddNew: boolean;
    onlyEnrollOnce: boolean;
    onAddNew: (arg: Record<string, any>) => void;
};
