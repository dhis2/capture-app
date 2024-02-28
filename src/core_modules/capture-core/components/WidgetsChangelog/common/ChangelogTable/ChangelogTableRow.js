// @flow
import React from 'react';
import { DataTableCell, DataTableRow } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { ChangelogChangeCell } from './ChangelogChangeCell';
import type { ChangelogRecord } from '../../Changelog/Changelog.types';

type Props = {|
    record: ChangelogRecord,
|}

const styles = {

};

const ChangelogTableRowPLain = ({ record }: Props) => (
    <DataTableRow>
        <DataTableCell>
            {record.date}
        </DataTableCell>
        <DataTableCell>
            {record.user}
        </DataTableCell>
        <DataTableCell>
            {record.dataItemLabel}
        </DataTableCell>

        <DataTableCell>
            <ChangelogChangeCell
                {...record}
            />
        </DataTableCell>
    </DataTableRow>
);

export const ChangelogTableRow = withStyles(styles)(ChangelogTableRowPLain);
