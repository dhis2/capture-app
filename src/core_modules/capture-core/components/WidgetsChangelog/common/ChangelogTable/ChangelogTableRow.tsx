import React from 'react';
import { DataTableCell, DataTableRow } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { ChangelogChangeCell, ChangelogValueCell } from './ChangelogCells';
import type { ChangelogRecord } from '../Changelog/Changelog.types';

type OwnProps = {
    record: ChangelogRecord;
};

const styles: Readonly<any> = {
    dataItemColumn: { wordWrap: 'break-word', hyphens: 'auto' },
};

type Props = OwnProps & WithStyles<typeof styles>;

const ChangelogTableRowPlain = ({ record, classes }: Props) => (
    <DataTableRow>
        <DataTableCell>{record.date}</DataTableCell>
        <DataTableCell>{record.user}</DataTableCell>
        <DataTableCell className={classes.dataItemColumn}>{record.dataItemLabel}</DataTableCell>
        <DataTableCell><ChangelogChangeCell changeType={record.changeType} /></DataTableCell>
        <DataTableCell><ChangelogValueCell {...record} /></DataTableCell>
    </DataTableRow>
);

export const ChangelogTableRow = withStyles(styles)(ChangelogTableRowPlain);
