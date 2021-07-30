// @flow

import { withStyles } from '@material-ui/core';
import { DataTableColumnHeader, DataTableRow } from '@dhis2/ui';
import React from 'react';
import i18n from '@dhis2/d2-i18n';

const styles = {
    CenteredHeader: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        textAlign: 'center',
    },
};

const ManagementsHeaderPlain = ({ classes }) => (
    <DataTableRow>
        <DataTableColumnHeader />
        <DataTableColumnHeader>
            <div>
                <p>{i18n.t('Status')}</p>
            </div>
        </DataTableColumnHeader>
        <DataTableColumnHeader>
            <div>
                <p>{i18n.t('Management')}</p>
            </div>
        </DataTableColumnHeader>
        <DataTableColumnHeader>
            <div className={classes.CenteredHeader}>
                <p>{i18n.t('Generation date')}</p>
            </div>
        </DataTableColumnHeader>
        <DataTableColumnHeader>
            <div className={classes.CenteredHeader}>
                <p>{i18n.t('Priority')}</p>
            </div>
        </DataTableColumnHeader>
        <DataTableColumnHeader>
            <div className={classes.CenteredHeader}>
                <p>{i18n.t('Notes')}</p>
            </div>
        </DataTableColumnHeader>
        <DataTableColumnHeader>
            <div className={classes.CenteredHeader}>
                <p>{i18n.t('Performed')}</p>
            </div>
        </DataTableColumnHeader>
    </DataTableRow>
);

export const ManagementsHeader = withStyles(styles)(ManagementsHeaderPlain);
