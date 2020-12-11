// @flow
import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import type { virtualizedOptionConfig } from './OptionsSelectVirtualized.component';

type Props = {
  option: virtualizedOptionConfig,
  style: Object,
  onSelect: (selectedOption: virtualizedOptionConfig) => void,
  currentlySelectedValues: ?Array<virtualizedOptionConfig>,
  classes: { popper: string },
};

const styles = () => ({
  popper: {
    zIndex: 9999,
  },
});

class OptionsSelectVirtualizedOption extends Component<Props> {
  static defaultContainerStyle = {
    cursor: 'pointer',
    paddingLeft: 5,
    overflow: 'hidden',
    paddingTop: 8,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };

  static selectedStyle = {};

  render() {
    const { option, style, onSelect, currentlySelectedValues, classes } = this.props;
    const { label } = option;
    const renderStyle = {
      ...OptionsSelectVirtualizedOption.defaultContainerStyle,
      ...style,
      ...(currentlySelectedValues && currentlySelectedValues.includes(option)
        ? OptionsSelectVirtualizedOption.selectedStyle
        : null),
    };

    return (
      <Tooltip
        title={option.label}
        placement="bottom"
        classes={{ popper: classes.popper }}
        enterDelay={800}
      >
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
        <div
          className="virtualized-select-option"
          style={renderStyle}
          onClick={() => {
            onSelect(option);
          }}
        >
          {label}
        </div>
      </Tooltip>
    );
  }
}

export default withStyles(styles)(OptionsSelectVirtualizedOption);
