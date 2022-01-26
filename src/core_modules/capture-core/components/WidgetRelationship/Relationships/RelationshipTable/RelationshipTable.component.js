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

type Props = {
    headers: Array<Object>,
    relationshipAttributes: Array<Object>,
     ...CssClasses,
}

const styles = { };

const RelationshipTablePlain = (props: Props) => {
    const { classes, headers, relationshipAttributes } = props;
    function renderHeader() {
        const headerCells = headers
            .map(column => (
                <DataTableColumnHeader
                    key={column.id}
                    name={column.id}
                >
                    {column.label}
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
        if (!relationshipAttributes) {
            return null;
        }
        return relationshipAttributes.map(({ id: teiId, attributes }) => (
            <DataTableRow key={teiId}>
                {headers.map(({ id }) => (<DataTableCell key={id}>
                    {attributes.find(att => att.attribute === id).value}
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
