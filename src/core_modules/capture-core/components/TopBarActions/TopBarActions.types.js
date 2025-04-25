// @flow

export type Props = {
    handleRefreshNewTeForm?: () => void,
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

