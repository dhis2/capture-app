// @flow
import React from 'react';
import { LoadingMask } from './LoadingMask.component';

type Props = {

};

export const LoadingMaskForButton = (props: Props) => (
    // $FlowFixMe[cannot-spread-inexact] automated comment
    <LoadingMask
        size={24}
        {...props}
    />
);
