// @flow
import React from 'react';
import LoadingMask from './LoadingMaskForButton.component';

type Props = {

};

const LoadingMaskForButton = (props: Props) => (
    <LoadingMask
        size={15}
        {...props}
    />
);

export default LoadingMaskForButton;
