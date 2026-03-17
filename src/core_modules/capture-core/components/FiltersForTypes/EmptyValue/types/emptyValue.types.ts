export type EmptyValueFilterCheckboxesProps = {
    value?: string | null;
    onEmptyChange: (args: { checked: boolean }) => void;
    onNotEmptyChange: (args: { checked: boolean }) => void;
    showDivider?: boolean;
    disabled?: boolean;
};

export type EmptyValueFilterData = {
    value: string;
    isEmpty?: boolean;
};
