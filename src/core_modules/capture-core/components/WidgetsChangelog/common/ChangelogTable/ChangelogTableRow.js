// @flow
import React from 'react';
import { DataTableCell, DataTableRow } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { ChangelogChangeCell, ChangelogValueCell } from './ChangelogCells';

type Props = {
    record: {
        date: string,
        user: string,
        dataItemLabel: string,
        changeType: string,
    },
    classes: {
        dataItemColumn: string,
        valueColumn: string,
    },
};

const styles = {
    dataItemColumn: { wordWrap: 'break-word', hyphens: 'auto' },
    valueColumn: { wordWrap: 'break-word' },
};

const ChangelogTableRowPlain = ({ record, classes }: Props) => (
    <DataTableRow>
        <DataTableCell>{record.date}</DataTableCell>
        <DataTableCell>{record.user}</DataTableCell>
        <DataTableCell className={classes.dataItemColumn}>{record.dataItemLabel}</DataTableCell>
        <DataTableCell><ChangelogChangeCell changeType={record.changeType} /></DataTableCell>
        <DataTableCell className={classes.valueColumn}><ChangelogValueCell {...record} /></DataTableCell>
    </DataTableRow>
);

export const ChangelogTableRow = withStyles(styles)(ChangelogTableRowPlain);
