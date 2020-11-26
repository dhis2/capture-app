// @flow
import * as React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { Settings as SettingsIcon } from '@material-ui/icons';
import i18n from '@dhis2/d2-i18n';
import { ColumnSelectorDialog } from './ColumnSelectorDialog.component';
import type { Columns } from '../types';

type Props = {
    onSave: Function,
    columns: Columns,
};

type State = {
    dialogOpen: boolean,
};

export class ColumnSelector extends React.PureComponent<Props, State> {
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

    handleSaveColumns = (columns: Columns) => {
        this.props.onSave(columns);
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
                    onSave={this.handleSaveColumns}
                    columns={columns}
                />
            </React.Fragment>
        );
    }
}
