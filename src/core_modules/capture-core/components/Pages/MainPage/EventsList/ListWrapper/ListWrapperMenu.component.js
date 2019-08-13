// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconButton, Paper, MenuList, MenuItem } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import Popper from '../../../../Popper/Popper.component';

import DownloadDialog from './DownloadDialog.container';

const dialogKeys = {
    COLUMN_SELECTOR: 'columnSelector',
    DOWNLOAD_TABLE: 'downloadTable',
};

type Props = {
    listId: string,
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
        /*
        remove until the functionality is there
        <MenuItem onClick={() => { this.openDialog(dialogKeys.COLUMN_SELECTOR, togglePopper); }}>
            {i18n.t('Save filter as...')}
        </MenuItem>
        */
        <MenuItem onClick={() => { this.openDialog(dialogKeys.DOWNLOAD_TABLE, togglePopper); }}>
            {i18n.t('Download as...')}
        </MenuItem>
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
                    open={this.state.dialogOpen[dialogKeys.DOWNLOAD_TABLE]}
                    onClose={() => { this.closeDialog(dialogKeys.DOWNLOAD_TABLE); }}
                    listId={this.props.listId}
                />
            </div>
        );
    }
}

export default ListWrapperMenu;
