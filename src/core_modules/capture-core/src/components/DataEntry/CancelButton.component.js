// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import ProgressButton from '../Buttons/ProgressButton.component';
import ConfirmDialog from '../Dialogs/ConfirmDialog.component';

type Props = {
    finalInProgress: boolean,
    dataEntryHasChanges: boolean,
    onCancel: () => void,
    options: Object,
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
        const {
            finalInProgress,
            options,
        } = this.props;

        return (
            <div>
                <ProgressButton
                    variant="text"
                    onClick={this.handleCancel}
                    color={options.color || 'primary'}
                    inProgress={finalInProgress}
                >
                    { i18n.t('Cancel') }
                </ProgressButton>
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
