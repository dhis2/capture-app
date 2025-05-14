import React, { useRef, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, Layer, Popper } from '@dhis2/ui';

interface Props {
    label?: string;
    primary?: boolean;
    secondary?: boolean;
    icon?: React.ReactElement;
    onClick?: () => void;
    open?: boolean;
    component: React.ReactNode;
    dataTest?: string;
    small?: boolean;
    large?: boolean;
    disabled?: boolean;
}

export const OverflowButton = ({
    label,
    primary,
    secondary,
    small,
    large,
    disabled,
    onClick: handleClick,
    open: propsOpen,
    icon,
    dataTest,
    component,
}: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const open = propsOpen !== undefined ? propsOpen : isOpen;

    const toggle = () => {
        if (propsOpen === undefined) {
            setIsOpen(prev => !prev);
        }
        handleClick?.();
    };

    return (
        <div ref={anchorRef}>
            <Button
                title={label ?? i18n.t('More')}
                primary={primary}
                secondary={secondary}
                dataTest={dataTest}
                disabled={disabled}
                small={small}
                large={large}
                onClick={toggle}
                icon={icon}
            >
                {label}
            </Button>

            {open && (
                <Layer onBackdropClick={toggle}>
                    <Popper reference={anchorRef as React.RefObject<HTMLDivElement>} placement="bottom-end">
                        {component}
                    </Popper>
                </Layer>
            )}
        </div>
    );
};
