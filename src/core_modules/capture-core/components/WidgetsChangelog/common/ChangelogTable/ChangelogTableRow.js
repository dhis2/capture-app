// @flow
import React from 'react';
import { DataTableCell, DataTableRow } from '@dhis2/ui';
import { ChangelogChangeCell } from './ChangelogChangeCell';
import type { ChangelogRecord } from '../Changelog/Changelog.types';

type Props = {|
    record: ChangelogRecord,
|}

export const ChangelogTableRow = ({ record }: Props) => (
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
