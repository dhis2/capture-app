import React, { type ComponentType, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors, spacersNum } from '@dhis2/ui';
import { withStyles } from 'capture-core-utils/styles';
import type { WithStyles } from 'capture-core-utils/styles';
import { Widget, WidgetHeaderCountBadge } from '../../../Widget';
import { ReadOnlyBadge } from '../../../ReadOnlyBadge';
import { useGroupedLinkedEntities } from './useGroupedLinkedEntities';
import { LinkedEntitiesViewer } from './LinkedEntitiesViewer.component';
import type { Props } from './relationshipsWidget.types';
import { LoadingMaskElementCenter } from '../../../LoadingMasks';
import { useDeleteRelationship } from './DeleteRelationship/useDeleteRelationship';

const styles = {
    header: {},
    emptyMessage: {
        padding: `0 ${spacersNum.dp12}px`,
        color: colors.grey600,
        fontSize: 14,
        lineHeight: '19px',
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
    readOnly,
    accessReadOnly,
    hideReadOnlyBadge,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const [open, setOpenStatus] = useState(true);
    const groupedLinkedEntities = useGroupedLinkedEntities(sourceId, relationshipTypes, relationships);
    const { onDeleteRelationship } = useDeleteRelationship({ sourceId });

    if (isLoading) {
        return (
            <Widget
                header={(
                    <div className={classes.header} />
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
                    <div className={classes.header} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <span>{title}</span>
                        {(relationships?.length ?? 0) > 0 && (
                            <WidgetHeaderCountBadge count={relationships!.length} />
                        )}
                        {!hideReadOnlyBadge && (
                            <div style={{ marginInlineStart: 'auto' }}>
                                <ReadOnlyBadge readOnly={Boolean(accessReadOnly)} />
                            </div>
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
                            readOnly={readOnly}
                        />
                    )
                }
                {(relationships?.length ?? 0) === 0 && (
                    <div className={classes.emptyMessage} data-test="relationships-empty-message">
                        {i18n.t("This enrollment doesn't have any relationships")}
                    </div>
                )}
                {children}
            </Widget>
        </div>
    );
};

export const RelationshipsWidget = withStyles(styles)(RelationshipsWidgetPlain) as ComponentType<Props>;
