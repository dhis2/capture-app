// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { ConfirmDialog } from '../Dialogs/ConfirmDialog.component';
import { defaultDialogProps } from '../Dialogs/ConfirmDialog.constants';

type Props = {
    dataEntryHasChanges: boolean,
    onCancel: () => void,
}

type State = {
    dialogOpen: boolean,
}

export class CancelButtonComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { dialogOpen: false };
    }
    handleCancel = () => {
        if (!this.props.dataEntryHasChanges) {
            this.props.onCancel();
            return;
        }
        this.setState({ dialogOpen: true });
    }

    handleCancelDiscard = () => {
        this.setState({ dialogOpen: false });
    }

    render() {
        return (
            <div>
                <Button
                    onClick={this.handleCancel}
                    secondary
                >
                    { i18n.t('Cancel') }
                </Button>
                <ConfirmDialog
                    {...defaultDialogProps}
                    onConfirm={this.props.onCancel}
                    open={this.state.dialogOpen}
                    onCancel={this.handleCancelDiscard}
                />
            </div>

        );
    }
}
