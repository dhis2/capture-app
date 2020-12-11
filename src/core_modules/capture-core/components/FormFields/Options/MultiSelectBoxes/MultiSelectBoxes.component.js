// @flow
/* eslint-disable react/no-array-index-key */
import React, { Component, type ComponentType } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { multiOrientations } from './multiSelectBoxes.const';

const styles = (theme) => ({
  label: theme.typography.formFieldTitle,
});

type Props = {
  onBlur: (value: any) => void,
  options: Array<{ text: string, value: any }>,
  label?: string,
  value?: any,
  orientation?: ?$Values<typeof multiOrientations>,
  required?: ?boolean,
  classes: {
    label: string,
  },
  style?: ?Object,
  passOnClasses?: ?Object,
};

class MultiSelectBoxesPlain extends Component<Props> {
  handleOptionChange: (e: Object, isChecked: boolean, value: any) => void;

  materialUIContainerInstance: any;

  checkedValues: ?Set<any>;

  goto: () => void;

  labelClasses: Object;

  constructor(props: Props) {
    super(props);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.labelClasses = this.buildLabelClasses();
  }

  buildLabelClasses() {
    return {
      root: this.props.classes.label,
    };
  }

  getBoxes(passOnProps: Object) {
    const { options } = this.props;
    return options.map(({ text, value }, index: number) => (
      <FormControlLabel
        control={
          <Checkbox
            onChange={(e: Object, isChecked: boolean) => {
              this.handleOptionChange(e, isChecked, value);
            }}
            checked={this.isChecked(value)}
            {...passOnProps}
          />
        }
        label={text}
        key={index}
      />
    ));
  }

  handleOptionChange(e: Object, isChecked: boolean, value: any) {
    this.handleSelectUpdate(isChecked, value);
  }

  handleSelectUpdate(isChecked: boolean, value: any) {
    let emitValues = null;

    if (isChecked) {
      if (this.checkedValues) {
        this.checkedValues.add(value);

        // $FlowFixMe[incompatible-call] automated comment
        emitValues = Array.from(this.checkedValues);
      } else {
        emitValues = [value];
      }
    } else if (this.checkedValues) {
      this.checkedValues.delete(value);

      // $FlowFixMe[incompatible-use] automated comment
      if (this.checkedValues.size > 0) {
        // $FlowFixMe[incompatible-call] automated comment
        emitValues = Array.from(this.checkedValues);
      } else {
        emitValues = null;
      }
    }

    this.props.onBlur(emitValues);
  }

  setCheckedStatusForBoxes() {
    const { value } = this.props;
    if (value || value === false || value === 0) {
      // $FlowFixMe[prop-missing] automated comment
      this.checkedValues = new Set(value);
    } else {
      this.checkedValues = null;
    }
  }

  isChecked(value: any) {
    return !!(this.checkedValues && this.checkedValues.has(value));
  }

  renderHorizontal(passOnProps: Object) {
    return <FormGroup row>{this.getBoxes(passOnProps)}</FormGroup>;
  }

  renderVertical(passOnProps: Object) {
    return <FormGroup>{this.getBoxes(passOnProps)}</FormGroup>;
  }

  renderCheckboxes(passOnProps: Object) {
    const { orientation } = this.props;
    return orientation === multiOrientations.VERTICAL
      ? this.renderVertical(passOnProps)
      : this.renderHorizontal(passOnProps);
  }

  render() {
    const {
      onBlur,
      options,
      label,
      value,
      orientation,
      required,
      classes,
      style,
      passOnClasses,
      ...passOnProps
    } = this.props; // eslint-disable-line no-unused-vars

    this.setCheckedStatusForBoxes();

    return (
      <div
        ref={(containerInstance) => {
          this.materialUIContainerInstance = containerInstance;
        }}
      >
        <FormControl component="fieldset">
          {(() => {
            if (!label) {
              return null;
            }

            return (
              <FormLabel
                component="label"
                required={!!required}
                classes={this.labelClasses}
                focused={false}
              >
                {label}
              </FormLabel>
            );
          })()}
          {this.renderCheckboxes({
            ...passOnProps,
            classes: passOnClasses,
          })}
        </FormControl>
      </div>
    );
  }
}

export const MultiSelectBoxes: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(
  MultiSelectBoxesPlain,
);
