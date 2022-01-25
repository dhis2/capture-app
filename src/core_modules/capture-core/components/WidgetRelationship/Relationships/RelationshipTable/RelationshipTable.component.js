// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import {
    DataTableBody,
    DataTableHead,
    DataTable,
    DataTableRow,
    DataTableCell,
    DataTableColumnHeader,
} from '@dhis2/ui';
import { useComputeTEI } from '../../hooks/useComputeTEI';

type Props = {
    from: Object,
    to: Object,
     ...CssClasses,
}

const styles = { };

const RelationshipTablePlain = (props: Props) => {
    const { classes, from, to } = props;
    const { headers, commonAttributes } = useComputeTEI(from, to);

    function renderHeader() {
        const headerCells = headers
            .map(column => (
                <DataTableColumnHeader
                    key={column.id}
                    name={column.id}
                >
                    {column.displayName}
                </DataTableColumnHeader>
            ));
        return (
            <DataTableRow
                className={classes.row}
            >
                {headerCells}
            </DataTableRow>
        );
    }
    const renderRelationshipRows = () => {
        if (!commonAttributes) {
            return null;
        }
        return Object.keys(commonAttributes).map(teiId => (
            <DataTableRow id={teiId}>
                {headers.map(({ attributeId }) => (<DataTableCell key={attributeId}>
                    {commonAttributes[teiId][attributeId].value}
                </DataTableCell>
                ))}
            </DataTableRow>
        ));
    };

    return (
        <DataTable
            className={classes.table}
        >
            <DataTableHead>
                {renderHeader()}
            </DataTableHead>
            <DataTableBody>
                {renderRelationshipRows()}
            </DataTableBody>
        </DataTable>
    );
};


export const RelationshipTable: ComponentType<Props> = withStyles(styles)(RelationshipTablePlain);
