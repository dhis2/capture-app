// @flow
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { ActionButtons } from './TopBarActions.component';
import { openNewRegistrationPageFromScopeSelector, openSearchPageFromScopeSelector } from './TopBarActions.actions';
import {
    resetAllCategoryOptionsFromScopeSelector,
    resetProgramIdBatchAction,
} from '../ScopeSelector/ScopeSelector.actions';
import { resetProgramIdBase } from '../ScopeSelector/QuickSelector/actions/QuickSelector.actions';
import { useReset, useSetOrgUnitId } from '../ScopeSelector/hooks';
import { ConfirmDialog } from '../Dialogs/ConfirmDialog.component';
import type { Props } from './TopBarActions.types';

const defaultDialogProps = {
    header: i18n.t('Unsaved changes'),
    text: i18n.t('Leaving this page will discard the changes you made to this event.'),
    confirmText: i18n.t('Yes, discard'),
    cancelText: i18n.t('No, stay here'),
};

export const TopBarActions = ({
    selectedProgramId,
    selectedOrgUnitId,
    isUserInteractionInProgress = false,
    customActionsOnProgramIdReset = [],
}: Props) => {
    const [openStartAgainWarning, setOpenStartAgainWarning] = useState(false);
    const dispatch = useDispatch();
    const { reset } = useReset();
    const { setOrgUnitId } = useSetOrgUnitId();
    const dontShowWarning = () => !isUserInteractionInProgress;

    const handleClose = () => {
        setOpenStartAgainWarning(false);
    };

    const handleOpenStartAgainWarning = () => {
        if (dontShowWarning()) {
            dispatch(resetAllCategoryOptionsFromScopeSelector());
            reset();
            return;
        }
        setOpenStartAgainWarning(true);
    };

    const openNewRegistrationPage = () => {
        if (dontShowWarning()) {
            dispatch(openNewRegistrationPageFromScopeSelector());
            return;
        }
        setOpenStartAgainWarning(true);
    };

    const handleOpenNewRegistrationPageWithoutProgramId = () => {
        if (dontShowWarning()) {
            const actions = [resetProgramIdBase(), openNewRegistrationPageFromScopeSelector()];
            dispatch(resetProgramIdBatchAction(actions));
            setOrgUnitId(selectedOrgUnitId, 'new', false);
            return;
        }
        setOpenStartAgainWarning(true);
    };

    const handleOpenSearchPage = () => {
        if (dontShowWarning()) {
            dispatch(openSearchPageFromScopeSelector());
            return;
        }
        setOpenStartAgainWarning(true);
    };

    const handleOpenSearchPageWithoutProgramId = () => {
        if (dontShowWarning()) {
            const actions = [resetProgramIdBase(), openSearchPageFromScopeSelector(), ...customActionsOnProgramIdReset];
            dispatch(resetProgramIdBatchAction(actions));
            setOrgUnitId(selectedOrgUnitId, 'search', false);
            return;
        }
        setOpenStartAgainWarning(true);
    };

    const handleAcceptStartAgain = () => {
        dispatch(openNewRegistrationPageFromScopeSelector());
        handleClose();
    };

    return (
        <>
            <ActionButtons
                selectedProgramId={selectedProgramId}
                onStartAgainClick={handleOpenStartAgainWarning}
                onFindClick={handleOpenSearchPage}
                onFindClickWithoutProgramId={handleOpenSearchPageWithoutProgramId}
                onNewClick={openNewRegistrationPage}
                onNewClickWithoutProgramId={handleOpenNewRegistrationPageWithoutProgramId}
                showResetButton={!!(selectedProgramId || selectedOrgUnitId)}
            />
            <ConfirmDialog
                onConfirm={handleAcceptStartAgain}
                open={openStartAgainWarning}
                onCancel={handleClose}
                {...defaultDialogProps}
            />
        </>
    );
};
