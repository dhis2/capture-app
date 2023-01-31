// @flow
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import i18n from '@dhis2/d2-i18n';
import { ActionButtons } from './TopBarActions.component';
import { ConfirmDialog } from '../Dialogs/ConfirmDialog.component';
import type { Props } from './TopBarActions.types';
import { buildUrlQueryString } from '../../utils/routing';

const defaultContext = {
    openStartAgainWarning: false,
    openNewRegistrationPage: false,
    openNewRegistrationPageWithoutProgramId: false,
    openSearchPage: false,
    openSearchPageWithoutProgramId: false,
    fallback: null,
};

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
    isSavingInProgress = false,
    onContextSwitch,
}: Props) => {
    const [context, setContext] = useState(defaultContext);
    const {
        openStartAgainWarning,
        openNewRegistrationPage,
        openNewRegistrationPageWithoutProgramId,
        openSearchPage,
        openSearchPageWithoutProgramId,
        fallback,
    } = context;
    const openConfirmDialog =
        openStartAgainWarning ||
        openNewRegistrationPage ||
        openNewRegistrationPageWithoutProgramId ||
        openSearchPage ||
        openSearchPageWithoutProgramId;
    const history = useHistory();

    useEffect(() => {
        if (!isSavingInProgress && fallback) {
            fallback();
            setContext(prev => ({ ...prev, fallback: null }));
        }
    }, [isSavingInProgress, fallback]);

    const startAgain = () => history.push('/');

    const newRegistrationPage = () => {
        const queryArgs = {};
        if (selectedOrgUnitId) {
            queryArgs.orgUnitId = selectedOrgUnitId;
        }
        if (selectedProgramId) {
            queryArgs.programId = selectedProgramId;
        }

        history.push(`new?${buildUrlQueryString(queryArgs)}`);
    };

    const newRegistrationPageWithoutProgramId = () => {
        const queryArgs = selectedOrgUnitId ? { orgUnitId: selectedOrgUnitId } : {};
        history.push(`new?${buildUrlQueryString(queryArgs)}`);
    };

    const searchPage = () => {
        const queryArgs = {};
        if (selectedOrgUnitId) {
            queryArgs.orgUnitId = selectedOrgUnitId;
        }
        if (selectedProgramId) {
            queryArgs.programId = selectedProgramId;
        }

        history.push(`search?${buildUrlQueryString(queryArgs)}`);
    };

    const searchPageWithoutProgramId = () => {
        const queryArgs = selectedOrgUnitId ? { orgUnitId: selectedOrgUnitId } : {};
        history.push(`search?${buildUrlQueryString(queryArgs)}`);
    };

    const handleOpenStartAgainWarning = () => {
        if (isSavingInProgress) {
            setContext(prev => ({ ...prev, fallback: () => startAgain() }));
            onContextSwitch && onContextSwitch();
            return;
        }
        isUserInteractionInProgress ? setContext(prev => ({ ...prev, openStartAgainWarning: true })) : startAgain();
    };

    const handleOpenNewRegistrationPage = () => {
        isUserInteractionInProgress
            ? setContext(prev => ({ ...prev, openNewRegistrationPage: true }))
            : newRegistrationPage();
    };

    const handleOpenNewRegistrationPageWithoutProgramId = () => {
        isUserInteractionInProgress
            ? setContext(prev => ({ ...prev, openNewRegistrationPageWithoutProgramId: true }))
            : newRegistrationPageWithoutProgramId();
    };

    const handleOpenSearchPage = () => {
        isUserInteractionInProgress ? setContext(prev => ({ ...prev, openSearchPage: true })) : searchPage();
    };

    const handleOpenSearchPageWithoutProgramId = () => {
        isUserInteractionInProgress
            ? setContext(prev => ({ ...prev, openSearchPageWithoutProgramId: true }))
            : searchPageWithoutProgramId();
    };

    const handleAccept = () => {
        openStartAgainWarning && startAgain();
        openNewRegistrationPage && newRegistrationPage();
        openNewRegistrationPageWithoutProgramId && newRegistrationPageWithoutProgramId();
        openSearchPage && searchPage();
        openSearchPageWithoutProgramId && searchPageWithoutProgramId();
        setContext(defaultContext);
    };

    return (
        <>
            <ActionButtons
                selectedProgramId={selectedProgramId}
                onStartAgainClick={handleOpenStartAgainWarning}
                onFindClick={handleOpenSearchPage}
                onFindClickWithoutProgramId={handleOpenSearchPageWithoutProgramId}
                onNewClick={handleOpenNewRegistrationPage}
                onNewClickWithoutProgramId={handleOpenNewRegistrationPageWithoutProgramId}
                showResetButton={!!(selectedProgramId || selectedOrgUnitId)}
                openConfirmDialog={openConfirmDialog}
            />
            <ConfirmDialog
                onConfirm={handleAccept}
                open={openConfirmDialog}
                onCancel={() => setContext(defaultContext)}
                {...defaultDialogProps}
            />
        </>
    );
};
