// @flow
import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';
import {
    DataTableBody,
    DataTableHead,
    DataTable,
    DataTableRow,
    DataTableCell,
    DataTableColumnHeader,
    Button,
    spacers,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { LinkedEntityData, RelationshipTableHeader, UrlParameters } from '../Types';


type Props = {
    headers: Array<RelationshipTableHeader>,
    linkedEntityData: Array<LinkedEntityData>,
    onLinkedRecordClick: (parameters: UrlParameters) => void,
    ...CssClasses,
}
const DEFAULT_NUMBER_OF_ROW = 5;

const styles = {
    row: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
    button: {
        marginTop: `${spacers.dp8}`,
    },
};

const RelationshipsTablePlain = ({ headers, linkedEntityData, classes, onLinkedRecordClick }: Props) => {
    const [displayedRowNumber, setDisplayedRowNumber] = useState(DEFAULT_NUMBER_OF_ROW);

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
        return linkedEntityData
            .slice(0, displayedRowNumber)
            .map(({ id: targetId, values, parameters }) => (
                <DataTableRow key={targetId}>
                    {headers.map(({ id }) => {
                        const entity = values.find(item => item.id === id);
                        return (
                            <DataTableCell
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
    const renderShowMoreButton = () => {
        const shouldShowMore = linkedEntityData.length > DEFAULT_NUMBER_OF_ROW
            && displayedRowNumber < linkedEntityData.length;
        return shouldShowMore ? (
            <Button
                small
                secondary
                dataTest="show-more-button"
                className={classes.button}
                onClick={() => {
                    const nextRowIndex = Math.min(linkedEntityData.length, displayedRowNumber + DEFAULT_NUMBER_OF_ROW);
                    setDisplayedRowNumber(nextRowIndex);
                }}
            >
                {i18n.t('Show {{ rest }} more', {
                    rest: Math.min(linkedEntityData.length - displayedRowNumber, DEFAULT_NUMBER_OF_ROW),
                })}
            </Button>
        ) : null;
    };

    return (
        <div>
            <DataTable>
                <DataTableHead>
                    {renderHeader()}
                </DataTableHead>
                <DataTableBody>
                    {renderRelationshipRows()}
                </DataTableBody>

            </DataTable>
            {renderShowMoreButton()}
        </div>
    );
};

export const RelationshipsTable = withStyles(styles)(RelationshipsTablePlain);
