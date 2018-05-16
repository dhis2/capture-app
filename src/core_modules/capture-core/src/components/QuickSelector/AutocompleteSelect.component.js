/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui-next/styles';
import Typography from 'material-ui-next/Typography';
import Input from 'material-ui-next/Input';
import { MenuItem } from 'material-ui-next/Menu';
import ArrowDropDownIcon from 'material-ui-icons/ArrowDropDown';
import CancelIcon from 'material-ui-icons/Cancel';
import ArrowDropUpIcon from 'material-ui-icons/ArrowDropUp';
import ClearIcon from 'material-ui-icons/Clear';
import Chip from 'material-ui-next/Chip';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { getTranslation } from '../../d2/d2Instance';

class Option extends React.Component {
  handleClick = (event) => {
      this.props.onSelect(this.props.option, event);
  };

  render() {
      const { children, isSelected, isFocused, onFocus } = this.props;

      return (
          <MenuItem
              onFocus={onFocus}
              selected={isFocused}
              onClick={this.handleClick}
              component="div"
              style={{
                  fontWeight: isSelected ? 500 : 400,
              }}
          >
              {children}
          </MenuItem>
      );
  }
}

function SelectWrapped(props) {
    const { classes, ...other } = props;

    return (
        <Select
            optionComponent={Option}
            openOnFocus
            noResultsText={<Typography>{ getTranslation('no_result_found') }</Typography>}
            arrowRenderer={arrowProps => (arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
            clearRenderer={() => <ClearIcon />}
            valueComponent={(valueProps) => {
                const { value, children, onRemove } = valueProps;

                const onDelete = (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onRemove(value);
                };

                if (onRemove) {
                    return (
                        <Chip
                            tabIndex={-1}
                            label={children}
                            className={classes.chip}
                            deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
                            onDelete={onDelete}
                        />
                    );
                }

                return <div className="Select-value">{children}</div>;
            }}
            {...other}
        />
    );
}

const ITEM_HEIGHT = 48;

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    chip: {
        margin: theme.spacing.unit / 4,
    },

    '@global': {
        '.Select-control': {
            display: 'flex',
            alignItems: 'center',
            border: 0,
            height: 'auto',
            background: 'transparent',
            '&:hover': {
                boxShadow: 'none',
            },
        },
        '.Select-multi-value-wrapper': {
            flexGrow: 1,
            display: 'flex',
            flexWrap: 'wrap',
        },
        '.Select--multi .Select-input': {
            margin: 0,
        },
        '.Select.has-value.is-clearable.Select--single > .Select-control .Select-value': {
            padding: 0,
        },
        '.Select-noresults': {
            padding: theme.spacing.unit * 2,
        },
        '.Select-input': {
            display: 'inline-flex !important',
            padding: 0,
            height: 'auto',
        },
        '.Select-input input': {
            background: 'transparent',
            border: 0,
            padding: 0,
            cursor: 'default',
            display: 'inline-block',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            margin: 0,
            outline: 0,
        },
        '.Select-placeholder, .Select--single .Select-value': {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.pxToRem(16),
            padding: 0,
        },
        '.Select-placeholder, .Select--single > .Select-control .Select-value': {
            color: 'black',
        },
        '.Select-placeholder': {
            opacity: 1,
            color: 'black',
        },
        '.Select-menu-outer': {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
            position: 'absolute',
            left: 0,
            top: `calc(100% + ${theme.spacing.unit}px)`,
            width: '100%',
            zIndex: 2,
            maxHeight: ITEM_HEIGHT * 4.5,
        },
        '.Select.is-focused:not(.is-open) > .Select-control': {
            background: 'transparent',
            boxShadow: 'none',
        },
        '.Select.is-focused > .Select-control': {
            background: 'transparent',
        },
        '.Select-menu': {
            maxHeight: ITEM_HEIGHT * 4.5,
            overflowY: 'auto',
        },
        '.Select-menu div': {
            boxSizing: 'content-box',
        },
        '.Select-arrow-zone, .Select-clear-zone': {
            color: theme.palette.action.active,
            cursor: 'pointer',
            height: 21,
            width: 21,
            zIndex: 1,
        },
        // Only for screen readers. We can't use display none.
        '.Select-aria-only': {
            position: 'absolute',
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            height: 1,
            width: 1,
            margin: -1,
        },
    },
});

type Props = {
    handleChange: (value: string) => void,
    selected: string,
    classes: Object,
};

class IntegrationReactSelect extends React.Component {
    handleChange: () => void;
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

  handleChange = () => (selectedOption) => {
    this.props.handleChange(selectedOption.value);
  };

  render() {
      const { classes } = this.props;
      const options = this.props.options.map(option  => ({
        value: option.id,
        label: option.name,
    }));

      return (
          <div className={classes.root}>
              <Input
                fullWidth
                inputComponent={SelectWrapped}
                value={this.props.selected}
                onChange={this.handleChange()}
                placeholder={this.props.placeholder}
                inputProps={{
                      classes,
                      options: options,
                  }}
            />
          </div>
      );
  }
}

IntegrationReactSelect.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationReactSelect);
