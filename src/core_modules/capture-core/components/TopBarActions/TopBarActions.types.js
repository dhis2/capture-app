// @flow

export type Props = {
    onOpenNewRegistrationPage?: () => void,
    selectedProgramId?: ?string,
    selectedOrgUnitId?: string,
    isUserInteractionInProgress?: boolean,
};

export type PlainProps = {
    selectedProgramId?: ?string,
    onNewClick: () => void,
    onNewClickWithoutProgramId: () => void,
    onFindClick: () => void,
    onFindClickWithoutProgramId: () => void,
    openConfirmDialog: boolean,
};

