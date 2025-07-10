export type Props = {
    onOpenNewRegistrationPage?: () => void;
    selectedProgramId?: string | null;
    selectedOrgUnitId?: string;
    isUserInteractionInProgress?: boolean;
};

export type PlainProps = {
    selectedProgramId?: string | null;
    onNewClick: () => void;
    onNewClickWithoutProgramId: () => void;
    onFindClick: () => void;
    onFindClickWithoutProgramId: () => void;
    openConfirmDialog: boolean;
};

