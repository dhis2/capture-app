// @flow
import React, { type ComponentType, useState } from 'react';
import { Chip, IconLink24, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { Widget } from '../../../Widget';
import { useGroupedLinkedEntities } from './useGroupedLinkedEntities';
import { LinkedEntitiesViewer } from './LinkedEntitiesViewer.component';
import type { Props, StyledProps } from './relationshipsWidget.types';
import { LoadingMaskElementCenter } from '../../../LoadingMasks';
import { useDeleteRelationship } from './DeleteRelationship/useDeleteRelationship';

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        paddingRight: spacers.dp8,
    },
};

const RelationshipsWidgetPlain = ({
    title,
    relationships,
    isLoading,
    sourceId,
    relationshipTypes,
    onLinkedRecordClick,
    children,
    classes,
}: StyledProps) => {
    const [open, setOpenStatus] = useState(true);
    const groupedLinkedEntities = useGroupedLinkedEntities(sourceId, relationshipTypes, relationships);
    const { onDeleteRelationship } = useDeleteRelationship({ sourceId });

    if (isLoading) {
        return (
            <Widget
                header={(
                    <div className={classes.header}>
                        <span className={classes.icon}>
                            <IconLink24 />
                        </span>
                    </div>
                )}
                onOpen={() => setOpenStatus(true)}
                onClose={() => setOpenStatus(false)}
                open={open}
            >
                <LoadingMaskElementCenter
                    containerStyle={{ height: '100px', marginBottom: '50px' }}
                />
            </Widget>
        );
    }

    return (
        <div
            data-test="tracked-entity-relationship-widget"
        >
            <Widget
                header={(
                    <div className={classes.header}>
                        <span className={classes.icon}>
                            <IconLink24 />
                        </span>
                        <span>{title}</span>
                        {relationships && (
                            <Chip dense>
                                {relationships.length}
                            </Chip>
                        )}
                    </div>
                )}
                onOpen={() => setOpenStatus(true)}
                onClose={() => setOpenStatus(false)}
                open={open}
            >
                {
                    groupedLinkedEntities && (
                        <LinkedEntitiesViewer
                            groupedLinkedEntities={groupedLinkedEntities}
                            onLinkedRecordClick={onLinkedRecordClick}
                            onDeleteRelationship={onDeleteRelationship}
                        />
                    )
                }
                {children}
            </Widget>
        </div>
    );
};

export const RelationshipsWidget: ComponentType<Props> = withStyles(styles)(RelationshipsWidgetPlain);
