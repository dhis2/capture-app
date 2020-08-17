// @flow
import * as React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { Settings as SettingsIcon } from '@material-ui/icons';
import i18n from '@dhis2/d2-i18n';
import { ColumnSelectorDialog } from './ColumnSelectorDialog.component';

type Props = {
    onSave: Function,
    columns: Array<Object>,
};

type State = {
    dialogOpen: boolean,
};

export class ColumnSelector extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            dialogOpen: false,
        };
    }

    openDialog = () => {
        this.setState({
            dialogOpen: true,
        });
    }

    closeDialog = () => {
        this.setState({
            dialogOpen: false,
        });
    }

    handleSaveColumnOrder = (columnOrder: Array<Object>) => {
        this.props.onSave(columnOrder);
        this.closeDialog();
    }

    render() {
        const { columns } = this.props;
        return (
            <React.Fragment>
                <Tooltip
                    disableFocusListener
                    disableTouchListener
                    enterDelay={500}
                    title={i18n.t('Select columns')}
                >
                    <IconButton
                        onClick={this.openDialog}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
                <ColumnSelectorDialog
                    open={this.state.dialogOpen}
                    onClose={this.closeDialog}
                    onSave={this.handleSaveColumnOrder}
                    columns={columns}
                />
            </React.Fragment>
        );
    }
}
