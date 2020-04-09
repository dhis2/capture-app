// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { MoreHoriz } from '@material-ui/icons';
import Popper from '../../../../Popper/Popper.component';
import DownloadDialog from './DownloadDialog.container';

const getStyles = () => ({
    subHeader: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 10,
        paddingBottom: 10,
        color: '#717c8b',
        fontWeight: 500,
        fontSize: 16,
        '&:focus': {
            outline: 'none',
            color: 'black',
        },
    },
    subHeaderDivider: {
        '&:focus': {
            outline: 'none',
            backgroundColor: 'black',
        },
    },
});

const dialogKeys = {
    DOWNLOAD_TABLE: 'downloadTable',
};

type MenuContentItem = {|
    key: string,
    clickHandler?: ?Function,
    element: React.Node,
|};

type MenuContentSubHeader = {|
    key: string,
    subHeader: React.Node,
|};

type MenuContent = MenuContentItem | MenuContentSubHeader;

type Props = {
    listId: string,
    customMenuContents?: ?Array<MenuContent>,
    classes: Object,
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
        const { customMenuContents, classes } = this.props;
        const customMenuItems = customMenuContents ?
            customMenuContents
                .map((content) => {
                    if (content.subHeader) {
                        return [
                            <Divider
                                key={`${content.key}divider`}
                                data-test={`subheader-divider-${content.key}`}
                                className={classes.subHeaderDivider}
                            />,
                            <div
                                key={content.key}
                                data-test={`subheader-${content.key}`}
                                className={classes.subHeader}
                            >
                                {content.subHeader}
                            </div>,
                        ];
                    }

                    return (
                        <MenuItem
                            key={content.key}
                            data-test={`menu-item-${content.key}`}
                            onClick={() => {
                                if (!content.clickHandler) {
                                    return;
                                }
                                togglePopper();
                                content.clickHandler();
                            }}
                            disabled={!content.clickHandler}
                        >
                            {content.element}
                        </MenuItem>
                    );
                })
                .flat(1)
            : [];

        return [(
            <MenuItem
                key="download"
                data-test="download-item"
                onClick={() => { this.openDialog(dialogKeys.DOWNLOAD_TABLE, togglePopper); }}
            >
                {i18n.t('Download data...')}
            </MenuItem>
        ),
        ...customMenuItems,
        ];
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
            <React.Fragment>
                <Popper
                    getPopperAction={this.renderPopperAction}
                    getPopperContent={this.renderPopperContent}
                />
                <DownloadDialog
                    open={this.state.dialogOpen === dialogKeys.DOWNLOAD_TABLE}
                    onClose={() => { this.closeDialog(); }}
                    listId={this.props.listId}
                />
            </React.Fragment>
        );
    }
}

export default withStyles(getStyles)(ListWrapperMenu);
