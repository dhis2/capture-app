// @flow

export type Props = {
    selectedProgramId?: string,
    selectedOrgUnitId?: string,
    isUserInteractionInProgress?: boolean,
};

export type PlainProps = {
    selectedProgramId?: string,
    onStartAgainClick: () => void,
    onNewClick: () => void,
    onNewClickWithoutProgramId: () => void,
    onFindClick: () => void,
    onFindClickWithoutProgramId: () => void,
    showResetButton: boolean,
    openConfirmDialog: boolean,
};

