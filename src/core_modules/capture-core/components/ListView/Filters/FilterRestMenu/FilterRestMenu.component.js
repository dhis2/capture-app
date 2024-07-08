// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { IconChevronDown16, IconChevronUp16, Button } from '@dhis2/ui';

import { Manager, Popper, Reference } from 'react-popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import i18n from '@dhis2/d2-i18n';

import type { Column } from '../../types';

const getStyles = (theme: Theme) => ({
    icon: {
        fontSize: theme.typography.pxToRem(20),
        paddingLeft: theme.typography.pxToRem(5),
    },
    restMenuButton: {
        backgroundColor: '#f5f5f5',
    },
    restMenuButtonLabel: {
        textTransform: 'none',
    },
    menuPaper: {
        maxHeight: 280,
        overflowY: 'auto',
    },
    menuItemRoot: {
        padding: 6,
        paddingLeft: 24,
        paddingRight: 24,
        fontSize: theme.typography.pxToRem(14),
    },
    popperContainerHidden: {
        display: 'none',
    },
    popper: {
        zIndex: 1,
    },
});

type Props = {
    columns: Array<Column>,
    onItemSelected: (id: string) => void,
    classes: {
        icon: string,
        restMenuButton: string,
        restMenuButtonLabel: string,
        menuPaper: string,
        menuItemRoot: string,
        popperContainerHidden: string,
    },
};

type State = {
    filterSelectorOpen: boolean,
};

class FilterRestMenuPlain extends React.Component<Props, State> {
    menuClasses: Object;
    menuItemClasses: Object;
    managerRef: any;
    menuReferenceInstance: ?HTMLDivElement;
    constructor(props: Props) {
        super(props);
        this.state = {
            filterSelectorOpen: false,
        };
        this.setClassesOnMount();
    }

    setClassesOnMount() {
        const classes = this.props.classes;
        this.menuClasses = {
            paper: classes.menuPaper,
        };

        this.menuItemClasses = {
            root: classes.menuItemRoot,
        };
    }
    closeMenu() {
        this.setState({
            filterSelectorOpen: false,
        });
    }

    toggleMenu() {
        this.setState({
            filterSelectorOpen: !this.state.filterSelectorOpen,
        });
    }

    handleMenuButtonClick = () => {
        this.toggleMenu();
    }

    handleClickAway = (event: any) => {
        if (this.menuReferenceInstance && this.menuReferenceInstance.contains(event.target)) {
            return;
        }
        this.closeMenu();
    }

    handleItemSelected = (id: string) => {
        this.closeMenu();
        this.props.onItemSelected(id);
    }

    renderMenuItems() {
        const columns = this.props.columns;
        return columns
            .map(column => (
                <MenuItem
                    key={column.id}
                    onClick={() => { this.handleItemSelected(column.id); }}
                    classes={this.menuItemClasses}
                >
                    {column.header}
                </MenuItem>
            ));
    }

    handleReferenceInstanceRetrieved = (instance) => {
        this.managerRef(instance);
        this.menuReferenceInstance = instance;
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
                                    <Button
                                        dataTest="more-filters"
                                        variant="outlined"
                                        color="default"
                                        size="small"
                                        classes={{ button: classes.restMenuButton }}
                                        muiClasses={{ label: classes.restMenuButtonLabel }}
                                        onClick={this.handleMenuButtonClick}
                                    >
                                        {i18n.t('More filters')}
                                        {this.state.filterSelectorOpen ? (
                                            <span className={classes.icon}>
                                                <IconChevronUp16 />
                                            </span>
                                        ) : (
                                            <span className={classes.icon}>
                                                <IconChevronDown16 />
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            );
                        }
                    }
                </Reference>
                {this.state.filterSelectorOpen &&
                <Popper
                    placement="bottom-start"
                >
                    {
                        ({ ref, style, placement }) => (
                            <div
                                ref={ref}
                                style={{ ...style, zIndex: 1 }}
                                data-placement={placement}
                            >
                                <ClickAwayListener onClickAway={this.handleClickAway}>
                                    <Grow
                                        in={!!this.state.filterSelectorOpen}
                                        id="menu-list-grow"
                                        style={{ transformOrigin: '0 0 0' }}
                                        timeout={{ exit: 0, enter: 200 }}
                                    >
                                        <Paper className={classes.menuPaper}>
                                            <MenuList role="menu">
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
        );
    }
}

export const FilterRestMenu = withStyles(getStyles)(FilterRestMenuPlain);
