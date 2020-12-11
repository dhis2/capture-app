// @flow
import * as React from 'react';
import defaultClasses from './textField.module.css';
import TextInput from '../internal/TextInput/TextInput.component';
import withFocusHandler from '../internal/TextInput/withFocusHandler';

type Classes = {
  input?: ?string,
  inputWrapper?: ?string,
};

type Props = {
  classes?: ?Classes,
  inputRef?: ?(ref: any) => void,
};

class D2TextField extends React.Component<Props> {
  render() {
    const { classes: optionalClasses, ...passOnProps } = this.props;
    const classes = optionalClasses || {};

    return (
      <div className={defaultClasses.container}>
        {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
        <TextInput classes={classes} {...passOnProps} />
      </div>
    );
  }
}

export default withFocusHandler()(D2TextField);
