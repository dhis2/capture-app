// @flow
import React from 'react';
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

export const RelationshipsTable = (props: Props) => {
    const { headers, relationshipAttributes } = props;
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
            <DataTableRow>
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
                {headers.map(({ id }) => {
                    const attribute = attributes.find(att => att.id === id);
                    return (<DataTableCell key={id}>
                        {attribute?.value}
                    </DataTableCell>
                    );
                })}
            </DataTableRow>
        ));
    };

    return (
        <DataTable>
            <DataTableHead>
                {renderHeader()}
            </DataTableHead>
            <DataTableBody>
                {renderRelationshipRows()}
            </DataTableBody>
        </DataTable>
    );
};
