// @flow
import React from 'react';
import { Tooltip } from '@dhis2/ui';

type Props = {
    enabled: boolean,
    className?: string,
    children: any,
    ...CssClasses,
};

export const ConditionalTooltip = (props: Props) => {
    const { enabled, className, children, ...passOnProps } = props;

    return enabled ?
        (<Tooltip {...passOnProps}>
            { ({ onMouseOver, onMouseOut, ref }) => (
                <span
                    className={className}
                    ref={(btnRef) => {
                        if (btnRef) {
                            btnRef.onpointerenter = onMouseOver;
                            btnRef.onpointerleave = onMouseOut;
                            ref.current = btnRef;
                        }
                    }}
                >
                    {children}
                </span>
            )}
        </Tooltip>) : children;
};
