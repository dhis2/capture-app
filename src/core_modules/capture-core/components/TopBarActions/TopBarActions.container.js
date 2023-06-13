// @flow
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ActionButtons } from './TopBarActions.component';
import { DiscardDialog } from '../Dialogs/DiscardDialog.component';
import type { Props } from './TopBarActions.types';
import { buildUrlQueryString } from '../../utils/routing';
import { defaultDialogProps } from '../Dialogs/DiscardDialog.constants';

const defaultContext = {
    openNewRegistrationPage: false,
    openNewRegistrationPageWithoutProgramId: false,
    openSearchPage: false,
    openSearchPageWithoutProgramId: false,
};

export const TopBarActions = ({
    selectedProgramId,
    selectedOrgUnitId,
    isUserInteractionInProgress = false,
}: Props) => {
    const [context, setContext] = useState(defaultContext);
    const {
        openNewRegistrationPage,
        openNewRegistrationPageWithoutProgramId,
        openSearchPage,
        openSearchPageWithoutProgramId,
    } = context;
    const openConfirmDialog =
        openNewRegistrationPage ||
        openNewRegistrationPageWithoutProgramId ||
        openSearchPage ||
        openSearchPageWithoutProgramId;
    const history = useHistory();

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
                onFindClick={handleOpenSearchPage}
                onFindClickWithoutProgramId={handleOpenSearchPageWithoutProgramId}
                onNewClick={handleOpenNewRegistrationPage}
                onNewClickWithoutProgramId={handleOpenNewRegistrationPageWithoutProgramId}
                openConfirmDialog={openConfirmDialog}
            />
            <DiscardDialog
                onDestroy={handleAccept}
                open={openConfirmDialog}
                onCancel={() => setContext(defaultContext)}
                {...defaultDialogProps}
            />
        </>
    );
};
