// @flow
import * as React from 'react';
import { useRef, useState } from 'react';
import { Button, Layer, Popper } from '@dhis2/ui';

type Props = {
    label?: string,
    primary?: boolean,
    secondary?: boolean,
    icon?: React.Node,
    onClick?: () => void,
    open?: boolean,
    component: React.Node,
    dataTest?: string,
    small?: boolean,
    large?: boolean,
};

export const OverflowButton = ({
    label,
    primary,
    secondary,
    small,
    large,
    onClick: handleClick,
    open: propsOpen,
    icon,
    dataTest,
    component,
}: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const anchorRef = useRef(null);
    const open = propsOpen !== undefined ? propsOpen : isOpen;

    const toggle = () => {
        if (propsOpen === undefined) {
            setIsOpen(prev => !prev);
        }
        handleClick && handleClick();
    };

    return (
        <div ref={anchorRef}>
            <Button
                primary={primary}
                secondary={secondary}
                dataTest={dataTest}
                small={small}
                large={large}
                onClick={toggle}
                icon={icon}
            >
                {label}
            </Button>

            {open && (
                <Layer onBackdropClick={toggle} transparent>
                    <Popper reference={anchorRef} placement="bottom-end">
                        {component}
                    </Popper>
                </Layer>
            )}
        </div>
    );
};
