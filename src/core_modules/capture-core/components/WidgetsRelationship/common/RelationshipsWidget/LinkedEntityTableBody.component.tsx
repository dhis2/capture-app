import React, { type ComponentType } from 'react';
import { withStyles } from 'capture-core-utils/styles';
import type { WithStyles } from 'capture-core-utils/styles';
import {
    DataTableBody,
    DataTableRow,
    DataTableCell,
    Tooltip,
} from '@dhis2/ui';
import { convertServerToClient } from '../../../../converters';
import { convert as convertClientToList } from '../../../../converters/clientToList';
import type { Props } from './linkedEntityTableBody.types';
import { DeleteRelationship } from './DeleteRelationship';
import { useTermLabel } from '../../../../metaData';
import { tCustomTerm } from '../../../../utils/tCustomTerm';

const styles: Readonly<any> = {
    row: {
        cursor: 'pointer',
    },
    rowDisabled: {
        cursor: 'not-allowed',
        opacity: 0.5,
    },
};

const LinkedEntityTableBodyPlain = ({
    linkedEntities,
    columns,
    onLinkedRecordClick,
    context,
    onDeleteRelationship,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const relationshipLabel = useTermLabel('relationship');
    return (
        <DataTableBody dataTest="relationship-table-body">
            {
                linkedEntities
                    .map(({ id: entityId, values, baseValues, navigation }) => {
                        const { pendingApiResponse, relationshipId } = baseValues || {};
                        return (
                            <DataTableRow
                                key={entityId}
                                dataTest={'relationship-table-row'}
                                className={pendingApiResponse ? classes.rowDisabled : classes.row}
                            >
                                {
                                    columns.map(({ id, type, options, convertValue }: any) => {
                                        const value = type ?
                                            convertClientToList(convertServerToClient(values[id], type), type, options) :
                                            convertValue(baseValues?.[id] ?? context.display[id]);

                                        return (
                                            <Tooltip
                                                key={`${entityId}-${id}`}
                                                content={tCustomTerm(
                                                    'To open this {{relationshipLabel}}, please wait until saving ' +
                                                    'is complete',
                                                    { relationshipLabel },
                                                )}
                                                closeDelay={50}
                                            >
                                                {({ onMouseOver, onMouseOut, ref }) => (
                                                    <DataTableCell
                                                        className={classes.row}
                                                        key={`${entityId}-${id}`}
                                                        onClick={() => !pendingApiResponse &&
                                                            onLinkedRecordClick({
                                                                ...context.navigation,
                                                                ...navigation,
                                                            } as Parameters<typeof onLinkedRecordClick>[0])
                                                        }
                                                        // @ts-expect-error - UI library expects a ref prop,
                                                        // but it is not defined in the types
                                                        ref={(tableCell) => {
                                                            if (tableCell) {
                                                                if (pendingApiResponse) {
                                                                    tableCell.onmouseover = onMouseOver;
                                                                    tableCell.onmouseout = onMouseOut;
                                                                    ref.current = tableCell;
                                                                } else {
                                                                    tableCell.onmouseover = null;
                                                                    tableCell.onmouseout = null;
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        {value}
                                                    </DataTableCell>
                                                )}
                                            </Tooltip>
                                        );
                                    })}
                                {context.display.showDeleteButton ? (
                                    <DeleteRelationship
                                        handleDeleteRelationship={() =>
                                            onDeleteRelationship({ relationshipId: relationshipId! })
                                        }
                                        disabled={pendingApiResponse}
                                    />
                                ) : null}
                            </DataTableRow>
                        );
                    })
            }
        </DataTableBody>
    );
};

export const LinkedEntityTableBody = withStyles(styles)(LinkedEntityTableBodyPlain) as ComponentType<Props>;
