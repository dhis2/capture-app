// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Button from '../../../../Buttons/Button.component';
import { getApi } from '../../../../../d2/d2Instance';

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

type Props = {
    open: ?boolean,
    onClose: Function,
    request: { url: string, queryParams: ?Object },
    programStageId: string,
    classes: Object,
}


class DownloadDialog extends React.Component<Props> {
    static getUrlEncodedParamsString(params: Object) {
        const { filter, ...restParams } = params;
        const searchParams = new URLSearchParams(restParams);

        if (filter) {
            filter.forEach((filterItem) => {
                searchParams.append('filter', filterItem);
            });
        }

        return searchParams.toString();
    }

    static getUrl() {
        const baseUrl = getApi().baseUrl;
        return `${baseUrl}/events/query`;
    }

    renderButtons() {
        const { request, programStageId, classes } = this.props;
        const url = DownloadDialog.getUrl();
        const { pageSize, page, totalPages, ...paramsFromRequest } = request.queryParams || {};
        const paramsObject = {
            ...paramsFromRequest,
            programStage: programStageId,
            skipPaging: 'true',
        };
        const searchParamsString = DownloadDialog.getUrlEncodedParamsString(paramsObject);

        return (
            <div
                className={classes.downloadContainer}
            >
                <div
                    className={classes.downloadLinkContainer}
                >
                    <a
                        download="events.json"
                        href={`${url}.json?${searchParamsString}`}
                        className={classes.downloadLink}
                    >
                        <Button>
                            {i18n.t('Download as JSON')}
                        </Button>
                    </a>
                </div>
                <div
                    className={classes.downloadLinkContainer}
                >
                    <a
                        download="events.xml"
                        href={`${url}.xml?${searchParamsString}`}
                        className={classes.downloadLink}
                    >
                        <Button>
                            {i18n.t('Download as XML')}
                        </Button>
                    </a>
                </div>
                <div>
                    <a
                        download="events.csv"
                        href={`${url}.csv?${searchParamsString}`}
                        className={classes.downloadLink}
                    >
                        <Button>
                            {i18n.t('Download as CSV')}
                        </Button>
                    </a>
                </div>
            </div>
        );
    }
    render() {
        const { open, onClose } = this.props;
        return (
            <span>
                <Dialog
                    open={!!open}
                    onClose={onClose}
                    fullWidth
                >
                    <DialogTitle>{i18n.t('Download with current filters')}</DialogTitle>
                    <DialogContent>
                        {this.renderButtons()}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} color="primary">
                            {i18n.t('Close')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </span>
        );
    }
}

export default withStyles(getStyles)(DownloadDialog);
