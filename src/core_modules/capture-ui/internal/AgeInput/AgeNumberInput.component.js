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

type State = {
  focus?: ?boolean,
};

class AgeNumberInput extends Component<Props, State> {
  constructor(props) {
    super(props);
    // eslint-disable-next-line react/no-unused-state
    this.state = { focus: false };
  }

  handleBlur = (event) => {
    this.props.onBlur(event.currentTarget.value);
    // eslint-disable-next-line react/no-unused-state
    this.setState({ focus: false });
  };

  handleChange = (event) => {
    this.props.onChange && this.props.onChange(event.currentTarget.value);
  };

  handleFocus = () => {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ focus: true });
  };

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
