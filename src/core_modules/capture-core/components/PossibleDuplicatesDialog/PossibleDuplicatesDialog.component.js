// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { ReviewDialogContents } from './ReviewDialogContents/ReviewDialogContents.container';
import type { RenderCustomCardActions } from '../CardList/CardList.types';

type Props = {|
    dataEntryId: string,
    open: boolean,
    onCancel: () => void,
    renderCardActions?: RenderCustomCardActions,
    extraActions?: ?React.Node,
    selectedScopeId: string
|};

const StyledDialogActions = withStyles({
    root: { margin: 24 },
})(DialogActions);

class ReviewDialogClass extends React.Component<Props > {
    static paperProps = {
        style: {
            maxHeight: 'calc(100% - 100px)',
        },
    };

    render() {
        const { open, onCancel, extraActions, selectedScopeId, dataEntryId, renderCardActions } = this.props;

        return (
            <Dialog
                open={open}
                onClose={onCancel}
                maxWidth="sm"
                fullWidth
                PaperProps={PossibleDuplicatesDialog.paperProps}
            >
                <ReviewDialogContents
                    dataEntryId={dataEntryId}
                    selectedScopeId={selectedScopeId}
                    renderCardActions={renderCardActions}
                />
                <StyledDialogActions>
                    {extraActions}
                </StyledDialogActions>
            </Dialog>
        );
    }
}

export const PossibleDuplicatesDialog = ReviewDialogClass;
