// @flow
import React from 'react';
import { Button, colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import type { ComponentProps } from './BulkActionBar.types';

const styles = {
    container: {
        marginTop: '65px',
        background: colors.green100,
        border: `1px solid ${colors.green400}`,
        width: '100%',
        padding: '10px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    },
};

export const BulkActionBarComponentPlain = ({
    selectedRowsCount,
    onClearSelection,
    children,
    classes,
}: ComponentProps) => (
    <div className={classes.container}>
        <span>
            {i18n.t('{{count}} record selected', {
                count: selectedRowsCount,
                defaultValue: '{{count}} record selected',
                defaultValue_plural: '{{count}} records selected',
            })}
        </span>

        {children}

        <Button
            small
            secondary
            onClick={onClearSelection}
        >
            {i18n.t('Cancel')}
        </Button>
    </div>
);

export const BulkActionBarComponent = withStyles(
    styles,
)(BulkActionBarComponentPlain);
