// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { Button, Modal, ModalTitle, ModalContent, ModalActions } from '@dhis2/ui';
import type { PlainProps } from './DownloadDialog.types';

const getStyles = () => ({
    downloadLink: {
        textDecoration: 'none',
        outline: 'none',
    },
    downloadLinkContainer: {
        paddingRight: 5,
        paddingBottom: 5,
    },
    downloadContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
});

const DownloadDialogPlain = ({ open, onClose, request = {}, absoluteApiPath, classes, hasCSVSupport }: PlainProps) => {
    const getUrlEncodedParamsString = (params: Object) => {
        const { filter, ...restParams } = params;
        const searchParams = new URLSearchParams(restParams);

        if (filter) {
            filter.forEach((filterItem) => {
                searchParams.append('filter', filterItem);
            });
        }

        return searchParams.toString();
    };

    const renderButtons = () => {
        const url = `${absoluteApiPath}/${request.url}`;
        const { pageSize, page, ...paramsFromRequest } = request.queryParams || {};
        const paramsObject = {
            ...paramsFromRequest,
            skipPaging: 'true',
        };
        const searchParamsString = getUrlEncodedParamsString(paramsObject);

        return (
            <div className={classes.downloadContainer}>
                <div className={classes.downloadLinkContainer}>
                    <a
                        download={`${request.url}.json`}
                        href={`${url}.json?${searchParamsString}`}
                        className={classes.downloadLink}
                    >
                        <Button>{i18n.t('Download as JSON')}</Button>
                    </a>
                </div>
                {hasCSVSupport &&
                    <div className={classes.downloadLinkContainer}>
                        <a
                            download={`${request.url}.csv`}
                            href={`${url}.csv?${searchParamsString}`}
                            className={classes.downloadLink}
                        >
                            <Button>{i18n.t('Download as CSV')}</Button>
                        </a>
                    </div>
                }
            </div>
        );
    };

    if (!open) {
        return null;
    }

    return (
        <Modal hide={!open} onClose={onClose} position={'center'} dataTest="working-lists-download-dialog">
            <ModalTitle>{i18n.t('Download with current filters')}</ModalTitle>
            <ModalContent>{renderButtons()}</ModalContent>
            <ModalActions>
                <Button onClick={onClose} color="primary">
                    {i18n.t('Close')}
                </Button>
            </ModalActions>
        </Modal>
    );
};

export const DownloadDialogComponent = withStyles(getStyles)(DownloadDialogPlain);
