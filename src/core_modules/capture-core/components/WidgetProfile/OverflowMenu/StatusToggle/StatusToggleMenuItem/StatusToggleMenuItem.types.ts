export type Props = {
    trackedEntityTypeName: string;
    isInactive: boolean;
    readOnly: boolean;
    setActionsIsOpen: (toggle: boolean) => void;
    setStatusToggleModalIsOpen: (toggle: boolean) => void;
};
