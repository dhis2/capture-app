import React, { ReactNode } from 'react';
import { Tooltip } from '@dhis2/ui';

type Props = {
    content: string;
    enabled: boolean;
    children: ReactNode;
};

export const ConditionalTooltip = ({ content, enabled, children }: Props) => {
    if (!enabled) {
        return <>{children}</>;
    }

    return (
        <Tooltip content={content}>
            {children}
        </Tooltip>
    );
};
