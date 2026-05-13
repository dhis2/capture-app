export type Props = {
    trackedEntityTypeName: string;
    trackedEntityInactive: boolean;
    setActionsIsOpen: (toggle: boolean) => void;
    setDeactivateModalIsOpen: (toggle: boolean) => void;
};
