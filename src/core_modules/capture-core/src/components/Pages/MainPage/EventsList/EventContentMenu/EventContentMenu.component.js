// @flow
import * as React from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';

type Props = {
    classes: {
        deleteIcon: string,
        menuList: string,
        popperContainerHidden: string,
        popperContainer: string,
    },
    onDelete: (eventId: string) => void,
    row: Object,
}

type State = {
    menuOpen: ?boolean,
}

const styles = theme => ({
    deleteIcon: {
        fill: theme.palette.error.main,
    },
    menuList: {
        padding: 0,
    },
    popperContainer: {
        zIndex: 100,
    },
});

class EventContentMenu extends React.Component<Props, State> {
    managerRef: (instance: any) => void;
    menuReferenceInstance: ?HTMLDivElement;

    constructor(props: Props) {
        super(props);
        this.state = { menuOpen: false };
    }

    handleDelete = (event: SyntheticEvent<any>) => {
        this.closeMenu();
        this.props.onDelete(this.props.row.eventId);
        event.stopPropagation();
    }

    handleReferenceInstanceRetrieved = (instance) => {
        this.managerRef(instance);
        this.menuReferenceInstance = instance;
    }

    toggleMenu = (event: any) => {
        this.setState({
            menuOpen: !this.state.menuOpen,
        });
        event.stopPropagation();
    }

    closeMenu = () => {
        this.setState({
            menuOpen: false,
        });
    }

    handleClickAway = (event: any) => {
        if (this.menuReferenceInstance && this.menuReferenceInstance.contains(event.target)) {
            return;
        }
        this.closeMenu();
    }

    renderMenuItems = () => {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <MenuItem onClick={this.handleDelete}>
                    <Delete className={classes.deleteIcon} />
                    {i18n.t('Delete event')}
                </MenuItem>
            </React.Fragment>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <Manager>
                <Reference>
                    {
                        ({ ref }) => {
                            this.managerRef = ref;
                            return (
                                <div
                                    ref={this.handleReferenceInstanceRetrieved}
                                >
                                    <IconButton
                                        onClick={this.toggleMenu}
                                    >
                                        <MoreHoriz />
                                    </IconButton>
                                </div>
                            );
                        }
                    }
                </Reference>
                {this.state.menuOpen &&
                <Popper
                    placement="bottom-end"
                >
                    {
                        ({ ref, style, placement }) => (
                            <div
                                ref={ref}
                                style={style}
                                className={classes.popperContainer}
                                data-placement={placement}
                            >
                                <ClickAwayListener onClickAway={this.handleClickAway}>
                                    <Grow
                                        in={!!this.state.menuOpen}
                                        id="menu-list-grow"
                                        style={{ transformOrigin: '0 0 0' }}
                                        timeout={{ exit: 0, enter: 200 }}
                                    >
                                        <Paper>
                                            <MenuList role="menu" className={classes.menuList}>
                                                {this.renderMenuItems()}
                                            </MenuList>
                                        </Paper>
                                    </Grow>
                                </ClickAwayListener>
                            </div>
                        )
                    }
                </Popper>}
            </Manager>
            /* <div>
                <IconButton
                    aria-owns={anchorEl ? 'event-content-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    <MoreHoriz />
                </IconButton>
                <Menu
                    id="event-content-menu"
                    anchorEl={anchorEl}
                    open={!!anchorEl}
                    onClose={this.handleClose}
                    MenuListProps={{ className: classes.menuList }}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem className={classes.menuItem} onClick={this.handleDelete}>
                        <Delete className={classes.deleteIcon} />
                        {i18n.t('Delete event')}
                    </MenuItem>
                </Menu>
            </div> */
        );
    }
}

export default withStyles(styles)(EventContentMenu);
