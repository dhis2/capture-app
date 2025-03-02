// @flow
import React from 'react';
import { Button, colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { ComponentProps } from './BulkActionBar.types';

export const BulkActionBarComponent = ({
    selectedRowsCount,
    onClearSelection,
    children,
}: ComponentProps) => (
    <div
        className="container"
        data-test="bulk-action-bar"
    >
        <span>
            {i18n.t('{{count}} selected', { count: selectedRowsCount })}
        </span>

        {children}

        <Button
            small
            secondary
            onClick={onClearSelection}
        >
            {i18n.t('Deselect all')}
        </Button>

        <style jsx>{`
            .container {
                background: ${colors.teal100};
                height: 60px;
                border: 2px solid ${colors.teal400};
                width: 100%;
                padding: 8px;
                font-size: 14px;
                gap: 8px;
                display: flex;
                align-items: center;
            }
        `}</style>
    </div>
);
