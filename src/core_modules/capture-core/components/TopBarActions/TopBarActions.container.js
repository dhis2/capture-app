// @flow
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import i18n from '@dhis2/d2-i18n';
import { ActionButtons } from './TopBarActions.component';
import { openNewRegistrationPageFromScopeSelector, openSearchPageFromScopeSelector } from './TopBarActions.actions';
import { resetAllCategoryOptionsFromScopeSelector } from '../ScopeSelector/ScopeSelector.actions';
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

    const handleClose = () => {
        setOpenStartAgainWarning(false);
    };

    const handleOpenStartAgainWarning = () => {
        if (isUserInteractionInProgress) {
            setOpenStartAgainWarning(true);
        } else {
            dispatch(resetAllCategoryOptionsFromScopeSelector());
            reset();
        }
    };

    const openNewRegistrationPage = () => {
        if (isUserInteractionInProgress) {
            setOpenStartAgainWarning(true);
        } else {
            dispatch(openNewRegistrationPageFromScopeSelector(selectedProgramId));
        }
    };

    const handleOpenNewRegistrationPageWithoutProgramId = () => {
        if (isUserInteractionInProgress) {
            setOpenStartAgainWarning(true);
        } else {
            const actions = [resetProgramIdBase(), openNewRegistrationPageFromScopeSelector()];
            dispatch(batchActions(actions));
            setOrgUnitId(selectedOrgUnitId, 'new', false);
        }
    };

    const handleOpenSearchPage = () => {
        if (isUserInteractionInProgress) {
            setOpenStartAgainWarning(true);
        } else {
            dispatch(openSearchPageFromScopeSelector(selectedProgramId));
        }
    };

    const handleOpenSearchPageWithoutProgramId = () => {
        if (isUserInteractionInProgress) {
            setOpenStartAgainWarning(true);
        } else {
            const actions = [resetProgramIdBase(), openSearchPageFromScopeSelector(), ...customActionsOnProgramIdReset];
            dispatch(batchActions(actions));
            setOrgUnitId(selectedOrgUnitId, 'search', false);
        }
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
