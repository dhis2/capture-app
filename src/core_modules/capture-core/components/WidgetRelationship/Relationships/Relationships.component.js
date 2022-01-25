// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { spacersNum, spacers, colors } from '@dhis2/ui';
import { RelationshipTable } from './RelationshipTable';

type Props = {
    teiRelationship: Object,
    ...CssClasses,
}

const styles = {
    container: {
        padding: `${spacers.dp8} ${spacers.dp16}`,
    },
    title: {
        fontWeight: 500,
        fontSize: 16,
        color: colors.grey800,
        paddingBottom: spacersNum.dp8,
    },
    wrapper: {
        paddingBottom: spacersNum.dp16,
    },
};
const RelationshipsPlain = ({ teiRelationship, classes }: Props) => (
    <div
        data-test="relationships"
        className={classes.container}
    >
        {
            teiRelationship ? teiRelationship.map((relationship) => {
                const { relationshipName, from, to } = relationship;
                return (<div className={classes.wrapper}>
                    <div className={classes.title} >{relationshipName}</div>
                    <RelationshipTable from={from} to={to} />
                </div>);
            }) : null
        }
    </div>
);

export const Relationships: ComponentType<Props> = withStyles(styles)(RelationshipsPlain);
