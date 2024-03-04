// @flow
import React, { useState, useMemo, type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import {
    DataTable,
    Button,
    spacers,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { LinkedEntityTableHeader } from './LinkedEntityTableHeader.component';
import { LinkedEntityTableBody } from './LinkedEntityTableBody.component';
import type { Props, StyledProps } from './linkedEntityTable.types';

const DEFAULT_VISIBLE_ROWS_COUNT = 5;

const styles = {
    button: {
        marginTop: `${spacers.dp8}`,
    },
    dataTableWrapper: {
        overflowY: 'auto',
        whiteSpace: 'nowrap',
    },
};

const LinkedEntityTablePlain = ({
    linkedEntities,
    columns,
    onLinkedRecordClick,
    onDeleteRelationship,
    context,
    classes,
}: StyledProps) => {
    const [visibleRowsCount, setVisibleRowsCount] = useState(DEFAULT_VISIBLE_ROWS_COUNT);

    const visibleLinkedEntities = useMemo(() =>
        linkedEntities.slice(0, visibleRowsCount),
    [linkedEntities, visibleRowsCount]);

    const showMoreButtonVisible = linkedEntities.length > visibleRowsCount;

    return (
        <div
            className={classes.dataTableWrapper}
        >
            <DataTable>
                <LinkedEntityTableHeader
                    columns={columns}
                    context={context}
                />
                <LinkedEntityTableBody
                    linkedEntities={visibleLinkedEntities}
                    columns={columns}
                    onLinkedRecordClick={onLinkedRecordClick}
                    context={context}
                    onDeleteRelationship={onDeleteRelationship}
                />
            </DataTable>
            {showMoreButtonVisible && (
                <Button
                    small
                    secondary
                    dataTest="show-more-button"
                    className={classes.button}
                    onClick={() => {
                        const updatedRowsCount =
                            Math.min(visibleRowsCount + DEFAULT_VISIBLE_ROWS_COUNT, linkedEntities.length);
                        setVisibleRowsCount(updatedRowsCount);
                    }}
                >
                    {i18n.t('Show {{ rest }} more', {
                        rest: Math.min(linkedEntities.length - visibleRowsCount, DEFAULT_VISIBLE_ROWS_COUNT),
                    })}
                </Button>
            )}
        </div>
    );
};

export const LinkedEntityTable: ComponentType<Props> = withStyles(styles)(LinkedEntityTablePlain);
