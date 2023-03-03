// @flow

export type Props = {
    selectedProgramId?: string,
    selectedOrgUnitId?: string,
    isUserInteractionInProgress?: boolean,
};

export type PlainProps = {
    selectedProgramId?: string,
    onNewClick: () => void,
    onNewClickWithoutProgramId: () => void,
    onFindClick: () => void,
    onFindClickWithoutProgramId: () => void,
    openConfirmDialog: boolean,
};

