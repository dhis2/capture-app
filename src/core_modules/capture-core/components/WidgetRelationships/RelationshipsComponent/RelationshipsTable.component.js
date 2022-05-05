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
    linkedEntityData: Array<Object>,
     ...CssClasses,
}

export const RelationshipsTable = (props: Props) => {
    const { headers, linkedEntityData } = props;
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
            <DataTableRow>
                {headerCells}
            </DataTableRow>
        );
    }
    const renderRelationshipRows = () => {
        if (!linkedEntityData) {
            return null;
        }
        return linkedEntityData.map(({ id: targetId, values }) => (
            <DataTableRow key={targetId}>
                {headers.map(({ id }) => {
                    const entity = values.find(item => item.id === id);
                    return (<DataTableCell key={id}>
                        {entity?.value}
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
