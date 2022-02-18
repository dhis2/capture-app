// @flow
import React from 'react';
import { spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { useFilteredRelationshipTypes, useRelationshipsForCurrentTEI } from '../../hooks';
import { RelationshipSelectorRow } from '../RelationshipSelectorRow/RelationshipSelectorRow';

const styles = {
    container: {
        padding: spacers.dp16,
        paddingTop: 0,
    },
    typeSelector: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp8,
        marginBottom: spacers.dp16,
    },
};

const RelationshipTypeSelectorPlain = ({ relationshipTypes, trackedEntityType, programId, onSelectType, classes }) => {
    const filteredRelationshipTypes = useFilteredRelationshipTypes(relationshipTypes, trackedEntityType, programId);
    const relationshipsForCurrentTEI = useRelationshipsForCurrentTEI({
        relationshipTypes: filteredRelationshipTypes,
        programId,
        trackedEntityType,
    });

    return (
        <div className={classes.container}>
            <div className={classes.typeSelector}>
                {relationshipsForCurrentTEI.map(relationship => (
                    <RelationshipSelectorRow
                        key={relationship.id}
                        relationship={relationship}
                        onSelectType={onSelectType}
                    />
                ))}
            </div>
        </div>
    );
};

export const RelationshipTypeSelector = withStyles(styles)(RelationshipTypeSelectorPlain);
