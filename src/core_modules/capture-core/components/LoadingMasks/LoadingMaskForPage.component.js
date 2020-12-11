// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LoadingMask from './LoadingMask.component';

const styles = () => ({
  container: {
    left: '50%',
    position: 'fixed',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

type Props = {
  classes: {
    container: string,
  },
};

const LoadingMaskForPage = (props: Props) => (
  <div className={props.classes.container}>
    <LoadingMask size={50} />
  </div>
);

export default withStyles(styles)(LoadingMaskForPage);
