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
    getPopperAction: (togglePopper: () => void) => React.Node,
    getPopperContent: (togglePopper: Function) => React.Node,
    placement?: ?string,
    classes?: ?Object,
}

type State = {
    popperOpen: ?boolean,
}

class MenuPopper extends React.Component<Props, State> {
    static defaultProps = {
        placement: 'bottom-end',
    }

    managerRef: (instance: any) => void;
    menuReferenceInstance: ?HTMLDivElement;

    constructor(props: Props) {
        super(props);
        this.state = { popperOpen: false };
    }

    handleReferenceInstanceRetrieved = (instance: any) => {
        this.managerRef(instance);
        this.menuReferenceInstance = instance;
    }

    toggleMenu = (event?: any) => {
        this.setState({
            popperOpen: !this.state.popperOpen,
        });
        event && event.stopPropagation();
    }

    closeMenu = () => {
        this.setState({
            popperOpen: false,
        });
    }

    handleClickAway = (event: any) => {
        if (this.menuReferenceInstance && this.menuReferenceInstance.contains(event.target)) {
            return;
        }
        this.closeMenu();
    }

    render() {
        const { classes, getPopperAction, getPopperContent } = this.props;

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
                                    {getPopperAction(this.toggleMenu)}
                                </div>
                            );
                        }
                    }
                </Reference>
                {this.state.popperOpen &&
                <Popper
                    placement={this.props.placement}
                >
                    {
                        ({ ref, style, placement }) => (
                            <div
                                ref={ref}
                                style={{ ...style, zIndex: 1 }}
                                className={classes ? classes.popperContainer : ''}
                                data-placement={placement}
                            >
                                <ClickAwayListener onClickAway={this.handleClickAway}>
                                    <Grow
                                        in={!!this.state.popperOpen}
                                        id="menu-list-grow"
                                        style={{ transformOrigin: '0 0 0' }}
                                        timeout={{ exit: 0, enter: 200 }}
                                    >
                                        <React.Fragment>
                                            {getPopperContent(this.toggleMenu)}
                                        </React.Fragment>
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

export default MenuPopper;
