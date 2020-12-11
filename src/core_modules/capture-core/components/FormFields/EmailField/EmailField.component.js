// @flow
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

type Props = {
  onChange: (value: string, event: UiEventData) => void,
  onBlur: (value: string, event: UiEventData) => void,
};

class D2EmailField extends Component<Props> {
  materialUIInstance: any;

  materialUIContainerInstance: any;

  handleChange: (event: UiEventData) => void;

  handleBlur: (event: UiEventData) => void;

  static defaultProps = {
      value: '',
  };

  constructor(props: Props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(event: UiEventData) {
      this.props.onChange(event.target.value, event);
  }

  handleBlur(event: UiEventData) {
      this.props.onBlur(event.target.value, event);
  }

  render() {
      const { onChange, onBlur, ...passOnProps } = this.props;

      return (
          <div ref={(containerInstance) => { this.materialUIContainerInstance = containerInstance; }}>
              {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
              <TextField
                  inputRef={(inst) => { this.materialUIInstance = inst; }}
                  {...passOnProps}
                  type="email"
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
              />
          </div>
      );
  }
}

export default D2EmailField;
