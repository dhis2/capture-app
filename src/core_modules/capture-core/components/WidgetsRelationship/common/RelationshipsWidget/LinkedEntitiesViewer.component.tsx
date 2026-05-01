import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import type { WithStyles } from 'capture-core-utils/styles';
import { withStyles } from 'capture-core-utils/styles';
import { spacersNum, spacers, colors } from '@dhis2/ui';
import { LinkedEntityTable } from './LinkedEntityTable.component';
import type { Props } from './linkedEntitiesViewer.types';

const styles = {
    container: {
        padding: `0 ${spacers.dp12} 0 ${spacers.dp12}`,
    },
    title: {
        fontWeight: 500,
        fontSize: 14,
        color: colors.grey900,
        paddingBottom: spacersNum.dp8,
    },
    wrapper: {
        paddingBottom: spacersNum.dp16,
    },
    emptyText: {
        color: colors.grey600,
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '19px',
        margin: 0,
        marginBottom: spacersNum.dp8,
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
            <p className={classes.emptyText}>
                {i18n.t('This enrollment doesn\'t have any relationships')}
            </p>
        )}
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
                        readOnly={readOnly}
                    />
                </div>
            );
        })}
    </div>);

export const LinkedEntitiesViewer = withStyles(styles)(LinkedEntitiesViewerPlain) as ComponentType<Props>;
