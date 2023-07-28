// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import {
    DataTableBody,
    DataTableRow,
    DataTableCell,
} from '@dhis2/ui';
import { convertServerToClient, convertClientToList } from '../../../../converters';
import type { Props, StyledProps } from './linkedEntityTableBody.types';

const styles = {
    row: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
};

const LinkedEntityTableBodyPlain = ({
    linkedEntities,
    columns,
    onLinkedRecordClick,
    context,
    classes,
}: StyledProps) => (
    <DataTableBody>
        {
            linkedEntities
                .map(({ id: entityId, values, baseValues, navigation }) => (
                    <DataTableRow key={entityId}>
                        {
                            // $FlowFixMe flow doesn't like destructering
                            columns.map(({ id, type, convertValue }) => {
                                const value = type ?
                                    convertClientToList(convertServerToClient(values[id], type), type) :
                                    convertValue(baseValues?.[id] ?? context.display[id]);

                                return (
                                    <DataTableCell
                                        className={classes.row}
                                        key={`${entityId}-${id}`}
                                        // $FlowFixMe
                                        onClick={() => onLinkedRecordClick({ ...context.navigation, ...navigation })}
                                    >
                                        {value}
                                    </DataTableCell>
                                );
                            })}
                    </DataTableRow>
                ))
        }
    </DataTableBody>
);

export const LinkedEntityTableBody: ComponentType<Props> = withStyles(styles)(LinkedEntityTableBodyPlain);
