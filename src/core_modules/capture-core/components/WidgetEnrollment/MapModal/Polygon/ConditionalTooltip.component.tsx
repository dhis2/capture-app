import React, { type ReactNode } from 'react';
import { Tooltip } from '@dhis2/ui';

type Props = {
    enabled: boolean;
    children: ReactNode;
    content?: string;
    position?: string;
};

export const ConditionalTooltip = (props: Props) => {
    const { enabled, children, ...passOnProps } = props;

    return enabled ?
        (<Tooltip {...passOnProps}>
            {/* @ts-ignore - Tooltip render function type mismatch */}
            { ({ onMouseOver, onMouseOut, ref }) => {
                const handleMouseOver = (e: any) => {
                    onMouseOver(e);
                };
                
                const handleMouseOut = (e: any) => {
                    onMouseOut(e);
                };
                
                return (
                    <span
                        ref={(btnRef) => {
                            if (btnRef) {
                                btnRef.onpointerenter = handleMouseOver;
                                btnRef.onpointerleave = handleMouseOut;
                                ref.current = btnRef;
                            }
                        }}
                    >
                        {children}
                    </span>
                );
            }}
        </Tooltip>) : children;
};
