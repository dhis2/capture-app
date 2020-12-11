// @flow
import React, { Component } from 'react';
import TextInput from '../TextInput/TextInput.component';
import withShrinkLabel from '../../HOC/withShrinkLabel';
import withFocusSaver from '../../HOC/withFocusSaver';
import withFocusHandler from '../TextInput/withFocusHandler';

type Props = {
  label: string,
  value: ?string,
  onBlur: (value: string) => void,
  onChange?: ?(value: string) => void,
  classes?: ?any,
};

class AgeNumberInput extends Component<Props> {
  handleBlur = (event) => {
    this.props.onBlur(event.currentTarget.value);
  };

  handleChange = (event) => {
    this.props.onChange && this.props.onChange(event.currentTarget.value);
  };

  handleFocus = () => {};

  render() {
    const { onBlur, onChange, value, classes, ...passOnProps } = this.props;
    return (
      // $FlowFixMe[cannot-spread-inexact] automated comment
      <TextInput
        classes={{}}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        value={value || ''}
        {...passOnProps}
      />
    );
  }
}

export default withFocusSaver()(withShrinkLabel()(withFocusHandler()(AgeNumberInput)));
