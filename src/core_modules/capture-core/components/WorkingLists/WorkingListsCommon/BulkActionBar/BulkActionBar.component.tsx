import React from 'react';
import { Button, colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { ContainerProps } from './BulkActionBar.types';

export const styles: Readonly<any> = {
    container: {
        background: colors.teal100,
        height: '60px',
        border: `2px solid ${colors.teal400}`,
        width: '100%',
        padding: '8px',
        fontSize: '14px',
        gap: '8px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'scroll',
    },
};

type Props = ContainerProps & WithStyles<typeof styles>;

export const BulkActionBarComponentPlain = ({
    selectedRowsCount,
    onClearSelection,
    children,
    classes,
}: Props) => (
    <div
        className={classes.container}
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
    </div>
);

export const BulkActionBarComponent = withStyles(
    styles,
)(BulkActionBarComponentPlain);
