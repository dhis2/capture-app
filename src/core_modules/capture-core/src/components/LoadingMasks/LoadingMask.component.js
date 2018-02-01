// @flow
import { CircularProgress } from 'material-ui-next/Progress';

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
