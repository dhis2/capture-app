// @flow
import React from 'react';
import {
    colors,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableFoot,
    DataTableHead,
    DataTableRow,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/';

type Props = {
    total?: ?number,
    isLoading: boolean,
    totalLabel?: string,
    children: React$Node,
    classes: {
        container: string,
        centeredHeaderCell: string,
    },
}

const styles = {
    container: {
        margin: '20px 0',
    },
    centeredHeaderCell: {
        display: 'flex',
        justifyContent: 'center',
    },
};

// TODO - Delete this component
export const EnrollmentTablePlain = ({
    total,
    isLoading,
    totalLabel = i18n.t('Total records to be completed'),
    children,
    classes,
}: Props) => (
    <div className={classes.container}>
        <DataTable>
            <DataTableHead>
                <DataTableColumnHeader>
                    {i18n.t('Status')}
                </DataTableColumnHeader>
                <DataTableColumnHeader className={classes.centeredHeaderCell} align={'right'}>
                    {i18n.t('Count')}
                </DataTableColumnHeader>
            </DataTableHead>
            <DataTableBody loading={isLoading}>
                {children}
            </DataTableBody>
            <DataTableFoot>
                <DataTableRow>
                    <DataTableCell
                        style={{ background: colors.grey050, borderTop: `2px solid ${colors.grey300}` }}
                    >
                        {totalLabel}
                    </DataTableCell>
                    <DataTableCell
                        style={{ background: colors.grey050, borderTop: `2px solid ${colors.grey300}` }}
                        align={'center'}
                    >
                        {total}
                    </DataTableCell>
                </DataTableRow>
            </DataTableFoot>
        </DataTable>
    </div>
);

export const BulkActionCountTable = withStyles(styles)(EnrollmentTablePlain);
