import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import type { WithStyles } from '@material-ui/core';
import {
    DataTableBody,
    DataTableRow,
    DataTableCell,
    Tooltip,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { convertServerToClient } from '../../../../converters';
import { convert as convertClientToList } from '../../../../converters/clientToList';
import type { Props } from './linkedEntityTableBody.types';
import { DeleteRelationship } from './DeleteRelationship';

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
}: Props & WithStyles<typeof styles>) => (
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
                                            content={i18n.t('To open this relationship, please wait until saving is complete')}
                                            closeDelay={50}
                                        >
                                            {({ onMouseOver, onMouseOut, ref }) => (
                                                <DataTableCell
                                                    className={classes.row}
                                                    key={`${entityId}-${id}`}
                                                    onClick={() => !pendingApiResponse &&
                                                        onLinkedRecordClick({ ...context.navigation, ...navigation } as any)
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

export const LinkedEntityTableBody = withStyles(styles)(LinkedEntityTableBodyPlain) as ComponentType<Props>;
