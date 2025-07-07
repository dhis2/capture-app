import React, { type ComponentType, useState } from 'react';
import { Chip, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { WithStyles } from '@material-ui/core';
import { Widget } from '../../../Widget';
import { useGroupedLinkedEntities } from './useGroupedLinkedEntities';
import { LinkedEntitiesViewer } from './LinkedEntitiesViewer.component';
import type { Props } from './relationshipsWidget.types';
import { LoadingMaskElementCenter } from '../../../LoadingMasks';
import { useDeleteRelationship } from './DeleteRelationship/useDeleteRelationship';

const styles: Readonly<any> = {
    chipContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: spacers.dp4,
    },
};

const RelationshipsWidgetPlain = ({
    title,
    relationships,
    relationshipTypes,
    isLoading,
    sourceId,
    onLinkedRecordClick,
    children,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const [open, setOpenStatus] = useState(true);
    const groupedLinkedEntities = useGroupedLinkedEntities(sourceId, relationshipTypes, relationships);
    const { onDeleteRelationship } = useDeleteRelationship({ sourceId });

    const relationshipsCount = groupedLinkedEntities.reduce((acc, group) => acc + group.linkedEntities.length, 0);

    return (
        <Widget
            header={
                <div className={classes.chipContainer}>
                    <span>{title}</span>
                    {relationshipsCount > 0 && (
                        <Chip dense>
                            {relationshipsCount}
                        </Chip>
                    )}
                </div>
            }
            onOpen={() => setOpenStatus(true)}
            onClose={() => setOpenStatus(false)}
            open={open}
        >
            {isLoading && <LoadingMaskElementCenter />}
            {!isLoading && groupedLinkedEntities.length === 0 && children}
            {!isLoading && groupedLinkedEntities.length > 0 && (
                <LinkedEntitiesViewer
                    groupedLinkedEntities={groupedLinkedEntities}
                    onLinkedRecordClick={onLinkedRecordClick}
                    onDeleteRelationship={onDeleteRelationship}
                />
            )}
        </Widget>
    );
};

export const RelationshipsWidget = withStyles(styles)(RelationshipsWidgetPlain) as ComponentType<Props>;
