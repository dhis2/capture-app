import React from 'react';
import { colors, spacersNum } from '@dhis2/ui';

type Props = {
    count: number;
};

export const WidgetHeaderCountBadge = ({ count }: Props) => (
    <span
        data-test="widget-header-count-badge"
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: spacersNum.dp16,
            padding: `3px ${spacersNum.dp8}px`,
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1,
            color: colors.grey800,
            backgroundColor: colors.grey300,
            borderRadius: '12px',
        }}
    >
        {count}
    </span>
);
