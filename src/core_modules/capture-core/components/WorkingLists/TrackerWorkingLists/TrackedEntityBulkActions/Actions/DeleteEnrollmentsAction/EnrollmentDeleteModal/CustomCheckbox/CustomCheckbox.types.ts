export type PlainProps = {
    label: string;
    checked: boolean;
    disabled?: boolean;
    id: string;
    onChange: (status: string) => void;
    dataTest?: string;
};
