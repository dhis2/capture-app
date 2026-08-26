import React from 'react';
import type { ComponentProps, FC, ReactNode } from 'react';
import { Tooltip, type TooltipRenderProps } from '@dhis2/ui';

type DhisTooltipProps = ComponentProps<typeof Tooltip>;

type Props = Omit<DhisTooltipProps, 'children' | 'enabled'> & {
    enabled: boolean;
    wrapperClassName?: string;
    children: ReactNode;
};

export const ConditionalTooltip: FC<Props> = (props) => {
    const { enabled, wrapperClassName, children, ...passOnProps } = props;

    if (!enabled) {
        return (
            <>
                {children}
            </>
        );
    }

    return (
        <Tooltip {...passOnProps}>
            {({ onMouseOver, onMouseOut, ref }: TooltipRenderProps) => (
                <span
                    className={wrapperClassName}
                    ref={(btnRef) => {
                        if (btnRef) {
                            // @ts-expect-error - keeping original functionality as before ts rewrite
                            btnRef.onpointerenter = onMouseOver;
                            // @ts-expect-error - keeping original functionality as before ts rewrite
                            btnRef.onpointerleave = onMouseOut;
                            ref.current = btnRef;
                        }
                    }}
                >
                    {children}
                </span>
            )}
        </Tooltip>
    );
};
