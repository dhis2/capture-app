// @flow
import React from 'react';
import { compose } from 'redux';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    CircularLoader,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    NoticeBox,
} from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';

import type { ComponentProps, Props } from './SearchStatus.types';
import { searchBoxStatus } from '../../../reducers/descriptions/searchDomain.reducerDescription';
import { SearchResults } from '../SearchResults';
import { NotEnoughAttributesMessage } from './NotEnoughAttributesMessage';

const getStyles = (theme: Theme) => ({
    informativeMessage: {
        marginLeft: theme.typography.pxToRem(10),
        marginTop: theme.typography.pxToRem(20),
        marginBottom: theme.typography.pxToRem(28),
        marginRight: theme.typography.pxToRem(10),
    },
    loadingMask: {
        display: 'flex',
        justifyContent: 'center',
    },
});

export const SearchStatusPlain = ({
    searchStatus,
    availableSearchOption,
    minAttributesRequiredToSearch,
    searchableFields,
    navigateToRegisterTrackedEntity,
    showInitialSearchBox,
    fallbackTriggered,
    uniqueTEAName = '',
    trackedEntityName,
    classes,
}: Props) => {
    if (searchStatus === searchBoxStatus.SHOW_RESULTS) {
        return <SearchResults availableSearchOption={availableSearchOption} fallbackTriggered={fallbackTriggered} />;
    }

    if (searchStatus === searchBoxStatus.NO_RESULTS) {
        return (
            <Modal position="middle">
                <ModalTitle>{i18n.t('No results found')}</ModalTitle>
                <ModalContent>
                    {i18n.t('You can change your search terms and search again to find what you are looking for.')}
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button type="button" onClick={navigateToRegisterTrackedEntity}>
                            {i18n.t(`Create new ${trackedEntityName}`)}
                        </Button>
                        <Button
                            disabled={searchStatus === searchBoxStatus.LOADING}
                            onClick={showInitialSearchBox}
                            primary
                        >
                            {i18n.t('Back to search')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        );
    }

    if (searchStatus === searchBoxStatus.LOADING) {
        return (
            <div className={classes.loadingMask}>
                <CircularLoader />
            </div>
        );
    }

    if (searchStatus === searchBoxStatus.ERROR) {
        return (
            <div data-test="general-purpose-error-mesage" className={classes.informativeMessage}>
                <NoticeBox title={i18n.t('An error has occurred')} error>
                    {i18n.t(
                        'There is a problem with this search, please change the search terms or try again later.' +
                            'For more details open the Console tab of the Developer tools ',
                    )}
                </NoticeBox>
            </div>
        );
    }

    if (searchStatus === searchBoxStatus.TOO_MANY_RESULTS) {
        return (
            <div data-test="general-purpose-too-many-results-mesage" className={classes.informativeMessage}>
                <NoticeBox title={i18n.t('Too many results')} warning>
                    {i18n.t(
                        'This search returned too many results to show. Try changing search terms or searching ' +
                            'by more attributes to narrow down the results.',
                    )}
                </NoticeBox>
            </div>
        );
    }

    if (searchStatus === searchBoxStatus.NOT_ENOUGH_ATTRIBUTES) {
        return (
            <Modal position="middle">
                <ModalTitle>{i18n.t('Cannot search in all programs')}</ModalTitle>
                <ModalContent>
                    <NotEnoughAttributesMessage
                        minAttributesRequiredToSearch={minAttributesRequiredToSearch}
                        searchableFields={searchableFields}
                    />
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button
                            disabled={searchStatus === searchBoxStatus.LOADING}
                            onClick={showInitialSearchBox}
                            type="button"
                        >
                            {i18n.t('Back to search')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        );
    }

    if (searchStatus === searchBoxStatus.UNIQUE_SEARCH_VALUE_EMPTY) {
        return (
            <Modal position="middle" onClose={showInitialSearchBox}>
                <ModalTitle>{i18n.t('Missing search criteria')}</ModalTitle>
                <ModalContent>
                    {i18n.t(`Please fill in ${uniqueTEAName} to search`)}
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button
                            disabled={searchStatus === searchBoxStatus.LOADING}
                            onClick={showInitialSearchBox}
                            primary
                        >
                            {i18n.t('Back to search')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        );
    }
    return null;
};

export const SearchStatus: ComponentType<ComponentProps> = compose(withStyles(getStyles))(SearchStatusPlain);
