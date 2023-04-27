// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { spacersNum, spacers, colors } from '@dhis2/ui';
import { RelationshipsTable } from './RelationshipsTable.component';
import type { Url } from '../../../../utils/url';

type Props = {
    relationships: Object,
    onAddRelationship: () => void,
    onLinkedRecordClick: (parameters: Url) =>void,
    ...CssClasses,
}

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
        '&:not(:last-first)': {
            paddingTop: spacersNum.dp24,
        },
        paddingBottom: spacersNum.dp16,
        overflow: 'scroll',
    },
};
const RelationshipsTablesPlain = ({ relationships, classes, onLinkedRecordClick }: Props) => (
    <div
        data-test="relationships"
        className={classes.container}
    >
        {relationships && relationships.map((relationship) => {
            const { relationshipName, id, ...passOnProps } = relationship;
            return (
                <div key={id} className={classes.wrapper}>
                    <div className={classes.title} >{relationshipName}</div>
                    <RelationshipsTable {...passOnProps} onLinkedRecordClick={onLinkedRecordClick} />
                </div>
            );
        })}
    </div>);

export const RelationshipTables: ComponentType<Props> = withStyles(styles)(RelationshipsTablesPlain);
