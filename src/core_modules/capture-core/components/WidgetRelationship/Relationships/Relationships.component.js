// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { spacersNum, spacers, colors } from '@dhis2/ui';
import { RelationshipTable } from './RelationshipTable';
import { useComputeTEIRelationship } from '../hooks/useComputeTEI';

type Props = {
    teiRelationship: Object,
    teiId: string,
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
const RelationshipsPlain = ({ teiId, teiRelationship, classes }: Props) => {
    const { relationshipsByType, headersByType } = useComputeTEIRelationship(teiId, teiRelationship);

    return (<div
        data-test="relationships"
        className={classes.container}
    >
        {
            relationshipsByType ? relationshipsByType.map((relationship) => {
                const { relationshipName, id, ...passOnProps } = relationship;
                return (<div key={id} className={classes.wrapper}>
                    <div className={classes.title} >{relationshipName}</div>
                    <RelationshipTable headers={headersByType[id]} {...passOnProps} />
                </div>);
            }) : null
        }
    </div>);
};

export const Relationships: ComponentType<Props> = withStyles(styles)(RelationshipsPlain);
