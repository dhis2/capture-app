// @flow
import CircularProgress from '@material-ui/core/CircularProgress';

import React from 'react';

type Props = {

};

export const LoadingMask = (props: Props) => {
    const { ...passOnProps } = props;

    return (
        <CircularProgress
            {...passOnProps}
        />
    );
};
