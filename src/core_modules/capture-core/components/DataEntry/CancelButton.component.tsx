import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { DiscardDialog } from '../Dialogs/DiscardDialog.component';
import { getDiscardDialogProps } from '../Dialogs/DiscardDialog.constants';

export type Props = {
    dataEntryHasChanges: boolean;
    disabled: boolean;
    onCancel: () => void;
    options: {
        color?: string;
    }
    eventLabel?: string;
};

export type State = {
    dialogOpen: boolean;
};


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
                    disabled={this.props.disabled}
                    secondary
                >
                    { i18n.t('Cancel') }
                </Button>
                <DiscardDialog
                    {...getDiscardDialogProps({ event: this.props.eventLabel })}
                    onDestroy={this.props.onCancel}
                    open={this.state.dialogOpen}
                    onCancel={this.handleCancelDiscard}
                />
            </div>

        );
    }
}
