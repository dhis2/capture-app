// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

type Props = {
  value?: ?any,
  valueConverter?: ?(value: any) => any,
  classes: {
    container: string,
  },
};

const getStyles = () => ({
  container: {
    width: '100%',
    fontWeight: 500,
  },
});

class ViewModeField extends React.Component<Props> {
  render() {
    const { value, valueConverter, classes } = this.props;
    const displayValue = valueConverter ? valueConverter(value) : value;

    return <div className={classes.container}>{displayValue}</div>;
  }
}

export default withStyles(getStyles)(ViewModeField);
