// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

import { Button } from './ButtonOld.component';
import { LoadingMaskForButton } from '../LoadingMasks';

const styles = () => ({
    wrapper: {
        position: 'relative',
    },
    progress: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50% ,-50%)',
        color: green[600],
    },
});

type Props = {
    inProgress: boolean,
    children: React.Node,
    classes: {
        wrapper: string,
        progress: string,
    }
};

const ProgressButtonPlain = (props: Props) => {
    const { inProgress, children, classes, ...buttonProps } = props;

    if (inProgress) {
        return (
            <div
                className={classes.wrapper}
            >
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <Button
                    disabled
                    {...buttonProps}
                >
                    {children}
                </Button>
                <LoadingMaskForButton
                    className={classes.progress}
                />
            </div>
        );
    }

    return (
        <Button
            {...buttonProps}
        >
            {children}
        </Button>
    );
};

export const ProgressButton = withStyles(styles)(ProgressButtonPlain);
