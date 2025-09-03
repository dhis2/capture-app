import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import { Button, Modal, ModalTitle, ModalContent, ModalActions } from '@dhis2/ui';
import type { PlainProps } from './DownloadDialog.types';

const getStyles: Readonly<any> = {
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
};

type Props = PlainProps & WithStyles<typeof getStyles>;

const DownloadDialogPlain = ({ open, onClose, request = {} as any, absoluteApiPath, classes }: Props) => {
    const getUrlEncodedParamsString = (params: any) => {
        const { filter, ...restParams } = params;
        const searchParams = new URLSearchParams(restParams);

        if (filter) {
            filter.forEach((filterItem: string) => {
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
            ...(featureAvailable(FEATURES.newPagingQueryParam)
                ? { paging: false }
                : { skipPaging: true }),
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
                <div className={classes.downloadLinkContainer}>
                    <a
                        download={`${request.url}.csv`}
                        href={`${url}.csv?${searchParamsString}`}
                        className={classes.downloadLink}
                    >
                        <Button>{i18n.t('Download as CSV')}</Button>
                    </a>
                </div>
            </div>
        );
    };

    if (!open) {
        return null;
    }

    return (
        <Modal hide={!open} onClose={onClose} position="middle" dataTest="working-lists-download-dialog">
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
