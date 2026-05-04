import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import type { WithStyles } from 'capture-core-utils/styles';
import { withStyles } from 'capture-core-utils/styles';
import { spacersNum, colors } from '@dhis2/ui';
import { LinkedEntityTable } from './LinkedEntityTable.component';
import type { Props } from './linkedEntitiesViewer.types';

const styles = {
    container: {
        padding: `0 ${spacersNum.dp12}px`,
    },
    section: {
        marginBottom: spacersNum.dp16,
    },
    title: {
        fontSize: 14,
        color: colors.grey900,
    },
    emptyText: {
        color: colors.grey600,
        fontSize: 14,
    },
};


const LinkedEntitiesViewerPlain = ({
    groupedLinkedEntities,
    onLinkedRecordClick,
    onDeleteRelationship,
    readOnly,
    classes,
}: Props & WithStyles<typeof styles>) => (
    <div
        data-test="relationships"
        className={classes.container}
    >
        {!groupedLinkedEntities?.length && (
            <div className={classes.emptyText}>
                {i18n.t('This enrollment doesn\'t have any relationships')}
            </div>
        )}
        {groupedLinkedEntities?.map((linkedEntityGroup) => {
            const { id, name, linkedEntities, columns, context } = linkedEntityGroup;
            return (
                <div key={id} className={classes.section}>
                    <div className={classes.title}>{name}</div>
                    <LinkedEntityTable
                        linkedEntities={linkedEntities}
                        columns={columns}
                        onLinkedRecordClick={onLinkedRecordClick}
                        onDeleteRelationship={onDeleteRelationship}
                        context={context}
                        readOnly={readOnly}
                    />
                </div>
            );
        })}
    </div>);

export const LinkedEntitiesViewer = withStyles(styles)(LinkedEntitiesViewerPlain) as ComponentType<Props>;
