export type EmptyValueFilterCheckboxesProps = {
    value?: string | null;
    onEmptyChange: (args: { checked: boolean }) => void;
    onNotEmptyChange: (args: { checked: boolean }) => void;
    showDivider?: boolean;
    disabled?: boolean;
};

export type WithEmptyValueFilterProps = {
    value: any;
    onCommitValue: (value: any) => void;
    disabled?: boolean;
    children: (filteredValue: any) => React.ReactNode;
};

export type EmptyValueFilterData = {
    value: string;
    isEmpty: boolean;
};
