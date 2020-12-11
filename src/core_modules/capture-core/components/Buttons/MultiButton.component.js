// @flow
import * as React from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import { withStyles } from '@material-ui/core/styles';
import Button from './ButtonOld.component';
import ProgressButton from './ProgressButton.component';

const styles = () => ({
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  arrowButton: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 6,
    paddingRight: 6,
    minWidth: 0,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  button: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  menuList: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});

type DropDownItem = {
  key: string,
  text: string,
  onClick: () => void,
};

type Props = {
  color: string,
  variant: string,
  buttonType: string,
  buttonText: string,
  buttonProps: Object,
  arrowProps: Object,
  dropDownItems: Array<DropDownItem>,
  classes: {
    buttonsContainer: string,
    arrowButton: string,
    button: string,
    menuList: string,
  },
};

type State = {
  menuOpen: boolean,
  anchorElement: ?Object,
};

class MultiButton extends React.Component<Props, State> {
  buttonInstance: ?Object;

  arrowInstance: ?Object;

  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      anchorElement: null,
    };
  }

  onMenuItemClick = (item: DropDownItem) => {
    this.toggleMenu();
    item.onClick();
  };

  toggleMenu = () => {
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      menuOpen: !this.state.menuOpen,
      anchorElement: this.buttonInstance,
    });
  };

  renderMenuItems = () =>
    this.props.dropDownItems.map((item) => (
      <MenuItem key={item.key} onClick={() => this.onMenuItemClick(item)}>
        {item.text}
      </MenuItem>
    ));

  render() {
    const { classes, color, variant } = this.props;
    const arrowButtonProps = { color, variant, ...this.props.arrowProps };
    const buttonProps = { color, variant, ...this.props.buttonProps };
    return (
      <div>
        <div
          className={classes.buttonsContainer}
          ref={(buttonInstance) => {
            this.buttonInstance = buttonInstance;
          }}
        >
          <div>
            {this.props.buttonType === 'progress' ? (
              <ProgressButton className={classes.button} {...buttonProps}>
                {this.props.buttonText}
              </ProgressButton>
            ) : (
              <Button className={classes.button} {...buttonProps}>
                {this.props.buttonText}
              </Button>
            )}
          </div>
          <div
            ref={(arrowInstance) => {
              this.arrowInstance = arrowInstance;
            }}
          >
            <Button
              onClick={this.toggleMenu}
              className={classes.arrowButton}
              variant={variant}
              color={color}
              {...arrowButtonProps}
            >
              {this.state.menuOpen ? <ArrowDropUp /> : <ArrowDropDown />}
            </Button>
          </div>
        </div>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorElement}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          elevation={10}
          open={this.state.menuOpen}
          onClose={this.toggleMenu}
          MenuListProps={{ className: classes.menuList }}
        >
          {this.renderMenuItems()}
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(MultiButton);
