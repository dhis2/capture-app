// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import createSvgIcon from '@material-ui/icons/utils/createSvgIcon';
import Tooltip from '@material-ui/core/Tooltip';
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import { Button } from '../../../../../Buttons';

const ClearIcon = createSvgIcon(
  <>
    <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
  </>,
  'CloseCircle',
);

const getStyles = (theme: Theme) => ({
  button: {
    backgroundColor: `${lighten(theme.palette.primary.light, 0.7)}!important`,
  },
  hovered: {
    backgroundColor: `${lighten(theme.palette.primary.light, 0.4)} !important`,
  },
  clearIcon: {
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
});

type State = {
  isHovered: boolean,
};

type Props = {
  onChange: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
  onClear: () => void,
  classes: {
    button: string,
    hovered: string,
    contents: string,
    clearIcon: string,
    label: string,
  },
  iconClass: string,
  title: string,
  arrowIconElement: React.Node,
  filterValue: string,
};

const MAX_LENGTH_OF_VALUE = 10;

class ActiveFilterButton extends React.Component<Props, State> {
  static stopClearPropagation(event: SyntheticEvent<any>) {
    event.stopPropagation();
  }

  static getCappedValue(value: string) {
    const cappedValue = value.substring(0, MAX_LENGTH_OF_VALUE - 3).trimRight();
    return `${cappedValue}...`;
  }

  static getViewValueForFilter(filterValue: string) {
    const calculatedValue =
      filterValue.length > MAX_LENGTH_OF_VALUE
        ? ActiveFilterButton.getCappedValue(filterValue)
        : filterValue;
    return `: ${calculatedValue}`;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      isHovered: false,
    };
  }

  setIsHovered = () => {
    this.setState({
      isHovered: true,
    });
  };

  clearIsHovered = () => {
    this.setState({
      isHovered: false,
    });
  };

  handleClearClick = (event: SyntheticMouseEvent<any>) => {
    event.stopPropagation();
    this.props.onClear();
  };

  render() {
    const { onChange, classes, iconClass, title, arrowIconElement, filterValue } = this.props;
    const { isHovered } = this.state;
    const buttonClasses = classNames(classes.button, { [classes.hovered]: isHovered });

    return (
      <div onMouseEnter={this.setIsHovered} onMouseLeave={this.clearIsHovered}>
        <Button className={buttonClasses} onClick={onChange}>
          {title}
          {ActiveFilterButton.getViewValueForFilter(filterValue)}
          {arrowIconElement}
          <Tooltip title={i18n.t('Clear')} placement="bottom" enterDelay={300}>
            <ClearIcon
              onMouseEnter={this.clearIsHovered}
              onMouseLeave={this.setIsHovered}
              className={classNames(iconClass, classes.clearIcon)}
              onClick={this.handleClearClick}
              onMouseDown={ActiveFilterButton.stopClearPropagation}
              onMouseUp={ActiveFilterButton.stopClearPropagation}
              onTouchStart={ActiveFilterButton.stopClearPropagation}
              onTouchEnd={ActiveFilterButton.stopClearPropagation}
              onTouchMove={ActiveFilterButton.stopClearPropagation}
              onKeyDown={ActiveFilterButton.stopClearPropagation}
              onKeyUp={ActiveFilterButton.stopClearPropagation}
            />
          </Tooltip>
        </Button>
      </div>
    );
  }
}

export default withStyles(getStyles)(ActiveFilterButton);
