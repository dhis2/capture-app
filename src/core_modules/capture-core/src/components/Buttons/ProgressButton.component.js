// @flow
import * as React from 'react';

import Button from './Button.component';
import LoadingMaskForButton from '../LoadingMasks/LoadingMaskForButton.component';

import { buttonStates } from './progressButton.const';

type Props = {
    buttonState: $Values<typeof buttonStates>,
    children: React.Node
};

const ProgressButton = (props: Props) => {
    const { buttonState, children, ...buttonProps } = props;

    if (buttonState === buttonStates.IN_PROGRESS) {
        return (
            <Button
                disabled
                {...buttonProps}
            >
                <LoadingMaskForButton />
            </Button>
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

export default ProgressButton;
