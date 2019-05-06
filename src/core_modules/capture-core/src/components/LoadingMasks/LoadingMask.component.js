// @flow
import CircularProgress from '@material-ui/core/CircularProgress';

import React from 'react';

type Props = {

};

const LoadingMask = (props: Props) => {
    const { ...passOnProps } = props;

    return (
        <CircularProgress
            {...passOnProps}
        />
    );
};

export default LoadingMask;
