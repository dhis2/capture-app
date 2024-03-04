// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { spacersNum, spacers, colors } from '@dhis2/ui';
import { LinkedEntityTable } from './LinkedEntityTable.component';
import type { Props, StyledProps } from './linkedEntitiesViewer.types';

const styles = {
    container: {
        padding: `0 ${spacers.dp16} ${spacers.dp12} ${spacers.dp16}`,
    },
    title: {
        fontWeight: 500,
        fontSize: 16,
        color: colors.grey800,
        paddingBottom: spacersNum.dp16,
    },
    wrapper: {
        paddingBottom: spacersNum.dp16,
    },
};


const LinkedEntitiesViewerPlain = ({
    groupedLinkedEntities,
    onLinkedRecordClick,
    onDeleteRelationship,
    classes,
}: StyledProps) => (
    <div
        data-test="relationships"
        className={classes.container}
    >
        {groupedLinkedEntities?.map((linkedEntityGroup) => {
            const { id, name, linkedEntities, columns, context } = linkedEntityGroup;
            return (
                <div key={id} className={classes.wrapper}>
                    <div className={classes.title}>{name}</div>
                    <LinkedEntityTable
                        linkedEntities={linkedEntities}
                        columns={columns}
                        onLinkedRecordClick={onLinkedRecordClick}
                        onDeleteRelationship={onDeleteRelationship}
                        context={context}
                    />
                </div>
            );
        })}
    </div>);

export const LinkedEntitiesViewer: ComponentType<Props> = withStyles(styles)(LinkedEntitiesViewerPlain);
