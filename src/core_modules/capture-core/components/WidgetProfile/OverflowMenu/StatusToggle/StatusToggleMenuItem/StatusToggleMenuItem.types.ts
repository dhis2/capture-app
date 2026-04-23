export type Props = {
    trackedEntityTypeName: string;
    isInactive: boolean;
    canWriteTETData: boolean;
    setActionsIsOpen: (toggle: boolean) => void;
    setStatusToggleModalIsOpen: (toggle: boolean) => void;
};
