// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Button from '../Buttons/Button.component';
import { getApi } from '../../d2/d2Instance';

type Props = {
    open: ?boolean,
    onClose: Function,
    request: { url: string, queryParams: ?Object },
}


class DownloadDialog extends React.Component<Props> {
    renderButtons = (request: Object) => {
        const baseUrl = getApi().baseUrl;
        const { pageSize, page, totalPages, ...paramsWithoutPaging } = request.queryParams || {};
        const searchParams = new URLSearchParams({ ...paramsWithoutPaging, skipPaging: true });
        const searchParamsString = searchParams.toString();
        return (
            <React.Fragment>
                <Button download href={`${baseUrl}/${request.url}.json?${searchParamsString}`}>
                    {i18n.t('Download as JSON')}
                </Button>
                <Button download href={`${baseUrl}/${request.url}.xml?${searchParamsString}`}>
                    {i18n.t('Download as XML')}
                </Button>
                <Button download href={`${baseUrl}/${request.url}.csv?${searchParamsString}`}>
                    {i18n.t('Download as CSV')}
                </Button>
            </React.Fragment>
        );
    }
    render() {
        const { open, onClose, request } = this.props;
        return (
            <span>
                <Dialog
                    open={!!open}
                    onClose={onClose}
                    fullWidth
                >
                    <DialogTitle>{i18n.t('Download with current filters')}</DialogTitle>
                    <DialogContent>
                        {request ? this.renderButtons(request) : null }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} color="primary">
                            {i18n.t('Cancel')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </span>
        );
    }
}

export default DownloadDialog;
