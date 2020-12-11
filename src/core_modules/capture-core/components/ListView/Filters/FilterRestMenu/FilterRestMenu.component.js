// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ArrowDownwardIcon from '@material-ui/icons/KeyboardArrowDown';
import ArrowUpwardIcon from '@material-ui/icons/KeyboardArrowUp';

import { Manager, Popper, Reference } from 'react-popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import i18n from '@dhis2/d2-i18n';
import Button from '../../../Buttons/Button.component';

import type { Column } from '../../types';

const getStyles = (theme: Theme) => ({
  icon: {
    fontSize: theme.typography.pxToRem(20),
    paddingLeft: theme.typography.pxToRem(5),
  },
  restMenuButton: {
    backgroundColor: theme.palette.grey[100],
  },
  restMenuButtonLabel: {
    textTransform: 'none',
  },
  menuPaper: {
    maxHeight: 30,
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

class FilterRestMenu extends React.Component<Props, State> {
  menuClasses: Object;

  menuItemClasses: Object;

  managerRef: (instance: any) => void;

  menuReferenceInstance: ?HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.state = {
      filterSelectorOpen: false,
    };
    this.setClassesOnMount();
  }

  setClassesOnMount() {
    const { classes } = this.props;
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
      // eslint-disable-next-line react/no-access-state-in-setstate
      filterSelectorOpen: !this.state.filterSelectorOpen,
    });
  }

  handleMenuButtonClick = () => {
    this.toggleMenu();
  };

  handleClickAway = (event: any) => {
    if (this.menuReferenceInstance && this.menuReferenceInstance.contains(event.target)) {
      return;
    }
    this.closeMenu();
  };

  handleItemSelected = (id: string) => {
    this.closeMenu();
    this.props.onItemSelected(id);
  };

  renderMenuItems() {
    const { columns } = this.props;
    return columns.map((column) => (
      <MenuItem
        key={column.id}
        onClick={() => {
          this.handleItemSelected(column.id);
        }}
        classes={this.menuItemClasses}
      >
        {column.header}
      </MenuItem>
    ));
  }

  handleReferenceInstanceRetrieved = (instance) => {
    this.managerRef(instance);
    this.menuReferenceInstance = instance;
  };

  render() {
    const { classes } = this.props;

    return (
      <Manager>
        <Reference>
          {({ ref }) => {
            this.managerRef = ref;
            return (
              <div ref={this.handleReferenceInstanceRetrieved}>
                <Button
                  variant="outlined"
                  color="default"
                  size="small"
                  classes={{ button: classes.restMenuButton }}
                  muiClasses={{
                    label: classes.restMenuButtonLabel,
                  }}
                  onClick={this.handleMenuButtonClick}
                >
                  {i18n.t('More filters')}
                  {this.state.filterSelectorOpen ? (
                    <ArrowUpwardIcon className={classes.icon} />
                  ) : (
                    <ArrowDownwardIcon className={classes.icon} />
                  )}
                </Button>
              </div>
            );
          }}
        </Reference>
        {this.state.filterSelectorOpen && (
          <Popper placement="bottom-start">
            {({ ref, style, placement }) => (
              <div ref={ref} style={{ ...style, zIndex: 1 }} data-placement={placement}>
                <ClickAwayListener onClickAway={this.handleClickAway}>
                  <Grow
                    in={!!this.state.filterSelectorOpen}
                    id="menu-list-grow"
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={{ exit: 0, enter: 200 }}
                  >
                    <Paper>
                      <MenuList role="menu">{this.renderMenuItems()}</MenuList>
                    </Paper>
                  </Grow>
                </ClickAwayListener>
              </div>
            )}
          </Popper>
        )}
      </Manager>
    );
  }
}

export default withStyles(getStyles)(FilterRestMenu);
