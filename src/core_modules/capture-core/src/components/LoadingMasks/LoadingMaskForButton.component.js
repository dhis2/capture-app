// @flow
import React from 'react';
import LoadingMask from './LoadingMask.component';

type Props = {

};

const LoadingMaskForButton = (props: Props) => (
    <LoadingMask
        size={24}
        {...props}
    />
);

export default LoadingMaskForButton;
