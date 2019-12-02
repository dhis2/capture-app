// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconButton, Paper, MenuList, MenuItem } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import Popper from '../../../../Popper/Popper.component';

import DownloadDialog from './DownloadDialog.container';
import SaveConfigDialog from './SaveConfigDialog.container';

const dialogKeys = {
    COLUMN_SELECTOR: 'columnSelector',
    DOWNLOAD_TABLE: 'downloadTable',
    SAVE_CONFIG: 'saveConfig',
};

type Props = {
    listId: string,
}

type State = {
    dialogOpen: ?$Values<typeof dialogKeys>,
}

class ListWrapperMenu extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            dialogOpen: undefined,
        };
    }
    renderPopperAction = (togglePopper: Function) => (
        <IconButton onClick={togglePopper}>
            <MoreHoriz />
        </IconButton>
    );

    openDialog = (key: $Values<typeof dialogKeys>, togglePopper: Function) => {
        togglePopper();
        this.setState({
            dialogOpen: key,
        });
    }

    closeDialog = (key: $Values<typeof dialogKeys>) => {
        this.setState({
            dialogOpen: undefined,
        });
    }

    renderMenuItems = (togglePopper: Function) => (
        /*
        remove until the functionality is there
        <MenuItem onClick={() => { this.openDialog(dialogKeys.COLUMN_SELECTOR, togglePopper); }}>
            {i18n.t('Save filter as...')}
        </MenuItem>
        */
       <React.Fragment>
            <MenuItem onClick={() => { this.openDialog(dialogKeys.DOWNLOAD_TABLE, togglePopper); }}>
                {i18n.t('Download as...')}
            </MenuItem>
            <MenuItem onClick={() => { this.openDialog(dialogKeys.SAVE_CONFIG, togglePopper); }}>
                {i18n.t('Save ')}
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
                <DownloadDialog
                    open={this.state.dialogOpen === dialogKeys.DOWNLOAD_TABLE}
                    onClose={() => { this.closeDialog(dialogKeys.DOWNLOAD_TABLE); }}
                    listId={this.props.listId}
                />
                <SaveConfigDialog
                    open={this.state.dialogOpen === dialogKeys.SAVE_CONFIG}
                    onClose={() => { this.closeDialog(dialogKeys.DOWNLOAD_TABLE); }}
                    listId={this.props.listId}
                />
            </div>
        );
    }
}

export default ListWrapperMenu;
