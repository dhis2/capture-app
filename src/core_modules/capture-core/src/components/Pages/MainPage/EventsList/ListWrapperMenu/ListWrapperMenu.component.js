// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconButton, Paper, MenuList, MenuItem } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import Popper from '../../../../Popper/Popper.component';
import ColumnSelectorDialog from '../../../../ColumnSelectorDialog/ColumnSelectorDialog.container';
import DownloadDialog from '../../../../DownloadTable/DownloadDialog.container';


const dialogKeys = {
    COLUMN_SELECTOR: 'columnSelector',
    DOWNLOAD_TABLE: 'downloadTable',
};

type Props = {
    columns: any,
}

type State = {
    dialogOpen: { [key: $Values<typeof dialogKeys>]: ?boolean },
}

class ListWrapperMenu extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { dialogOpen: {} };
    }
    renderPopperAction = (togglePopper: Function) => (
        <IconButton onClick={togglePopper}>
            <MoreHoriz />
        </IconButton>
    );

    openDialog = (key: $Values<typeof dialogKeys>, togglePopper: Function) => {
        togglePopper();
        this.setState({ dialogOpen: { ...this.state.dialogOpen, [key]: true } });
    }

    closeDialog = (key: $Values<typeof dialogKeys>) => {
        this.setState({ dialogOpen: { ...this.state.dialogOpen, [key]: false } });
    }

    renderMenuItems = (togglePopper: Function) => (
        <React.Fragment>
            <MenuItem onClick={() => { this.openDialog(dialogKeys.COLUMN_SELECTOR, togglePopper); }}>
                {i18n.t('Show/hide columns')}
            </MenuItem>
            <MenuItem onClick={() => { this.openDialog(dialogKeys.COLUMN_SELECTOR, togglePopper); }}>
                {i18n.t('Save filter as...')}
            </MenuItem>
            <MenuItem onClick={() => { this.openDialog(dialogKeys.DOWNLOAD_TABLE, togglePopper); }}>
                {i18n.t('Download as...')}
            </MenuItem>
        </React.Fragment>
    )

    renderPopperContent = (togglePopper: Function) => (
        <Paper>
            <MenuList role="menu">
                {this.renderMenuItems(togglePopper)}
            </MenuList>
        </Paper>
    )

    render() {
        return (
            <div>
                <Popper
                    getPopperAction={this.renderPopperAction}
                    getPopperContent={this.renderPopperContent}
                />
                <ColumnSelectorDialog
                    open={this.state.dialogOpen[dialogKeys.COLUMN_SELECTOR]}
                    onClose={() => { this.closeDialog(dialogKeys.COLUMN_SELECTOR); }}
                    columns={this.props.columns}
                />
                <DownloadDialog
                    open={this.state.dialogOpen[dialogKeys.DOWNLOAD_TABLE]}
                    onClose={() => { this.closeDialog(dialogKeys.DOWNLOAD_TABLE); }}
                    listId={this.props.listId}
                />
            </div>
        );
    }
}

export default ListWrapperMenu;
