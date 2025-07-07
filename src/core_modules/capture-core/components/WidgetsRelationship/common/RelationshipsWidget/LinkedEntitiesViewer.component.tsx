import React, { type ComponentType } from 'react';
import type { WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import { spacersNum, spacers, colors } from '@dhis2/ui';
import { LinkedEntityTable } from './LinkedEntityTable.component';
import type { Props } from './linkedEntitiesViewer.types';

const styles: Readonly<any> = {
    container: {
        padding: spacers.dp16,
        paddingTop: spacersNum.dp8,
        borderTop: `1px solid ${colors.grey300}`,
    },
    groupContainer: {
        paddingBottom: spacers.dp16,
    },
    groupName: {
        fontSize: '14px',
        fontWeight: 500,
        color: colors.grey900,
        paddingBottom: spacers.dp8,
    },
};

const LinkedEntitiesViewerPlain = ({
    groupedLinkedEntities,
    onLinkedRecordClick,
    onDeleteRelationship,
    classes,
}: Props & WithStyles<typeof styles>) => (
    <div
        data-test="relationships"
        className={classes.container}
    >
        {groupedLinkedEntities.map(({ id, name, linkedEntities, columns, context }) => (
            <div key={id} className={classes.groupContainer}>
                <div className={classes.groupName}>
                    {name}
                </div>
                <LinkedEntityTable
                    linkedEntities={linkedEntities}
                    columns={columns}
                    onLinkedRecordClick={onLinkedRecordClick}
                    context={context}
                    onDeleteRelationship={onDeleteRelationship}
                />
            </div>
        ))}
    </div>);

export const LinkedEntitiesViewer = withStyles(styles)(LinkedEntitiesViewerPlain) as ComponentType<Props>;
