// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CircularLoader } from '@dhis2/ui';

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

const LoadingMaskForPagePlain = (props: Props) => (
    <div
        className={props.classes.container}
    >
        <CircularLoader />
    </div>
);

export const LoadingMaskForPage = withStyles(styles)(LoadingMaskForPagePlain);
