// @flow
import React, { type ComponentType, useState } from 'react';
import { Chip, IconLink24, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { Widget } from '../../../Widget';
import { useGroupedLinkedEntities } from './useGroupedLinkedEntities';
import { useRelationshipTypes } from './useRelationshipTypes';
import { LinkedEntitiesViewer } from './LinkedEntitiesViewer.component';
import type { Props, StyledProps } from './relationshipsWidget.types';

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
    cachedRelationshipTypes,
    sourceId,
    onLinkedRecordClick,
    children,
    classes,
}: StyledProps) => {
    const [open, setOpenStatus] = useState(true);
    const { data: relationshipTypes } = useRelationshipTypes(cachedRelationshipTypes);
    const groupedLinkedEntities = useGroupedLinkedEntities(sourceId, relationshipTypes, relationships);

    return (
        <div
            data-test="relationship-widget"
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
                        />
                    )
                }{
                    relationshipTypes && children(relationshipTypes)
                }
            </Widget>
        </div>
    );
};

export const RelationshipsWidget: ComponentType<Props> = withStyles(styles)(RelationshipsWidgetPlain);
