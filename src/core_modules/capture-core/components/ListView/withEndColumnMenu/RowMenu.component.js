// @flow
import * as React from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import { Card, spacers, IconMore24, colors, Layer } from '@dhis2/ui';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Props, State } from './rowMenu.types';

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
    iconButton: {
        display: 'flex',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        background: 'transparent',
        padding: spacers.dp12,
        marginTop: `-${spacers.dp12}`,
        marginBottom: `-${spacers.dp12}`,
        color: colors.grey600,
        '&:hover': {
            background: colors.grey400,
        },
    },
});

class Index extends React.Component<Props, State> {
    managerRef: any;
    menuReferenceInstance: ?HTMLDivElement;

    constructor(props: Props) {
        super(props);
        this.state = { menuOpen: false };
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
        const { customRowMenuContents = [], row, classes } = this.props;

        const menuItems = customRowMenuContents
            .map(content => (
                <MenuItem
                    key={content.key}
                    data-test={`menu-item-${content.key}`}
                    onClick={(event: SyntheticEvent<any>) => {
                        if (!content.clickHandler) {
                            return;
                        }
                        this.closeMenu();
                        // $FlowFixMe common flow, I checked this 4 lines up
                        content.clickHandler(row);
                        event.stopPropagation();
                    }}
                    disabled={!content.clickHandler}
                >
                    {content.element}
                </MenuItem>
            ));

        return (
            <MenuList role="menu" className={classes.menuList}>
                {menuItems}
            </MenuList>
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
                                    <button
                                        data-test="event-content-menu"
                                        onClick={this.toggleMenu}
                                        className={classes.iconButton}
                                    >
                                        <IconMore24 />
                                    </button>
                                </div>
                            );
                        }
                    }
                </Reference>
                {this.state.menuOpen &&
                <Layer onBackdropClick={this.handleClickAway} >
                    <Popper
                        placement="bottom-end"
                        strategy={'fixed'}
                    >
                        {
                            ({ ref, style, placement }) => (
                                <div
                                    ref={ref}
                                    style={style}
                                    className={classes.popperContainer}
                                    data-placement={placement}
                                >
                                    <Grow
                                        in={!!this.state.menuOpen}
                                        id="menu-list-grow"
                                        style={{ transformOrigin: '0 0 0' }}
                                        timeout={{ exit: 0, enter: 200 }}
                                    >
                                        <Card>
                                            {this.renderMenuItems()}
                                        </Card>
                                    </Grow>
                                </div>
                            )
                        }
                    </Popper>
                </Layer>
                }
            </Manager>
        );
    }
}

export const RowMenu = withStyles(styles)(Index);
