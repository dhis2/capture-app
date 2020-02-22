// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconButton, Paper, MenuList, MenuItem } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import Popper from '../../../../Popper/Popper.component';
import DownloadDialog from './DownloadDialog.container';

const dialogKeys = {
    DOWNLOAD_TABLE: 'downloadTable',
};

type Props = {
    listId: string,
    customMenuContents?: ?Array<{clickHandler: Function, element: React.Element<any>}>,
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

    closeDialog = () => {
        this.setState({
            dialogOpen: undefined,
        });
    }

    renderMenuItems = (togglePopper: Function) => {
        const { customMenuContents } = this.props;
        const customMenuItems = customMenuContents ?
            customMenuContents
                .map(content => (
                    <MenuItem
                        onClick={() => {
                            togglePopper();
                            content.clickHandler();
                        }}
                    >
                        {content.element}
                    </MenuItem>
                )) : null;

        return (
            <React.Fragment>
                <MenuItem onClick={() => { this.openDialog(dialogKeys.DOWNLOAD_TABLE, togglePopper); }}>
                    {i18n.t('Download as...')}
                </MenuItem>
                {customMenuItems}
            </React.Fragment>
        );
    }

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
            </div>
        );
    }
}

export default ListWrapperMenu;
