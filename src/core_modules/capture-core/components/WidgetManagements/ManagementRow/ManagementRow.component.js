// @flow
import React from 'react';
import { DataTableCell, DataTableRow } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { ManagementPriority } from '../ManagementCells/ManagementPriority';
import type { Management } from '../WidgetManagements.types';
import { ManagementStatus } from '../ManagementCells/ManagementStatus';
import { ManagementTitle } from '../ManagementCells/ManagementTitle';
import { ManagementStatuses } from '../ManagementObjects';
import { ManagementGenerationDate } from '../ManagementCells/ManagementGenerationDate';
import { ManagementNotes } from '../ManagementCells/ManagementNotes';
import { ManagementActionCell } from '../ManagementCells/ManagementActionCell';

const styles = {
    Selector: {
        padding: '5px 8px',
        border: '1px solid #CECECEFF',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#eeeeee',
        },
    },
};

type Props = {|
    management: Management,
    ...CssClasses
|}

const ManagementRowPlain = ({ management, classes }: Props) => {
    const performed = management.status === ManagementStatuses.completed;

    return (
        <DataTableRow
            expandableContent={<div>Test</div>}
        >
            <ManagementStatus status={management.status} />

            <ManagementTitle
                displayName={management.displayName}
                performed={performed}
                reason={management.reason}
            />

            <DataTableCell width={'5%'}>
                <div style={{ display: 'flex' }}>
                    <div className={classes.Selector} style={{ borderRadius: '8px 0 0 8px' }}>Yes</div>
                    <div className={classes.Selector} style={{ borderRadius: '0 8px 8px 0' }}>No</div>
                </div>
            </DataTableCell>

            <ManagementGenerationDate
                generationdate={management.generationdate}
                performed={performed}
            />

            <ManagementPriority priority={management.priority} />

            <ManagementNotes showIcon={!!management?.notes?.length} />

            <ManagementActionCell />
        </DataTableRow>
    );
};

export const ManagementRow = withStyles(styles)(ManagementRowPlain);

