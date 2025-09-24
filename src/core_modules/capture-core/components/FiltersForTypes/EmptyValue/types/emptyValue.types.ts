export type EmptyValueFilterCheckboxesProps = {
    value?: string | null;
    onEmptyChange: (args: { checked: boolean }) => void;
    onNotEmptyChange: (args: { checked: boolean }) => void;
};

export type EmptyValueFilterData = {
    value: string;
    isEmpty?: boolean;
};
