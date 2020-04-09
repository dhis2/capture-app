// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import LoadingMask from './LoadingMask.component';

const styles = () => ({
    container: {
        left: '45%',
        position: 'fixed',
        top: '45%',
    },
});

type Props = {
    classes: {
        container: string,
    },
};

const LoadingMaskForPage = (props: Props) => (
    <div
        className={props.classes.container}
    >
        <LoadingMask
            size={50}
        />
    </div>
);

export default withStyles(styles)(LoadingMaskForPage);
