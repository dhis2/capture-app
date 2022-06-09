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
import type { Url } from '../../../utils/url';

type Props = {
    headers: Array<Object>,
    linkedEntityData: Array<Object>,
    onLinkedRecordClick: (parameters: Url) => void,
     ...CssClasses,
}

const styles = {
    row: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
};

const RelationshipsTablePlain = (props: Props) => {
    const { headers, linkedEntityData, onLinkedRecordClick, classes } = props;
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
        return linkedEntityData.map(({ id: targetId, values, parameters }) => (
            <DataTableRow key={targetId}>
                {headers.map(({ id }) => {
                    const entity = values.find(item => item.id === id);
                    return (<DataTableCell
                        className={classes.row}
                        key={id}
                        onClick={() => onLinkedRecordClick(parameters)}
                    >
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

export const RelationshipsTable: ComponentType<Props> = withStyles(styles)(RelationshipsTablePlain);
