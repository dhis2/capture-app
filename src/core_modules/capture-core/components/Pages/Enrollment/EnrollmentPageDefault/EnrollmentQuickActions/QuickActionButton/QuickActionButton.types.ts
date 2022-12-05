export type QuickActionButtonTypes = {
    icon: JSX.Element;
    label: string;
    onClickAction: () => void;
    dataTest?: string;
    disable?: boolean;
};
