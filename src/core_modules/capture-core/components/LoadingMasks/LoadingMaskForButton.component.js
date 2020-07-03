// @flow
import React from 'react';
import LoadingMask from './LoadingMask.component';

type Props = {

};

const LoadingMaskForButton = (props: Props) => (
    // $FlowFixMe[cannot-spread-inexact] automated comment
    <LoadingMask
        size={24}
        {...props}
    />
);

export default LoadingMaskForButton;
