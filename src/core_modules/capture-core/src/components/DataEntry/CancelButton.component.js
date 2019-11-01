// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '../Buttons';
import ConfirmDialog from '../Dialogs/ConfirmDialog.component';

type Props = {
    dataEntryHasChanges: boolean,
    onCancel: () => void,
}

type State = {
    dialogOpen: boolean,
}

export default class CancelButton extends React.Component<Props, State> {
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
                    header={i18n.t('Unsaved changes')}
                    text={i18n.t('Leaving this page will discard the changes you made to this event.')}
                    confirmText={i18n.t('Yes, discard')}
                    cancelText={i18n.t('No, stay here')}
                    onConfirm={this.props.onCancel}
                    open={this.state.dialogOpen}
                    onCancel={this.handleCancelDiscard}
                />
            </div>

        );
    }
}
