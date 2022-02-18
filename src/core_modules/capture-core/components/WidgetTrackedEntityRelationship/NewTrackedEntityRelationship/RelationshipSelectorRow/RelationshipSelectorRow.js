// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { Button, spacers } from '@dhis2/ui';

const styles = {
    selectorButton: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp4,
        marginBottom: spacers.dp8,
    },
    title: {
        fontWeight: 500,
        marginBottom: spacers.dp4,
    },
    buttonContainer: {
        display: 'flex',
        gap: spacers.dp8,
    },
};

const RelationshipSelectorRowPlain = ({ relationship, onSelectType, classes }) => (
    <div
        key={relationship.id}
        className={classes.selectorButton}
    >
        <div className={classes.title}>
            {relationship.displayName}
        </div>
        <div>
            <div className={classes.buttonContainer}>
                {relationship.fromConstraint && (
                    <Button
                        onClick={() => onSelectType({
                            id: relationship.id,
                            displayName: relationship.displayName,
                            constraint: relationship.fromConstraint,
                            constraintSide: 'from',
                        })}
                        secondary
                    >
                        {relationship.fromConstraint.displayName}
                    </Button>
                )}
                {relationship.toConstraint && (
                    <Button
                        onClick={() => onSelectType({
                            id: relationship.id,
                            displayName: relationship.displayName,
                            constraint: relationship.toConstraint,
                            constraintSide: 'to',
                        })}
                        secondary
                    >
                        {relationship.toConstraint.displayName}
                    </Button>
                )}
            </div>
        </div>
    </div>
);

export const RelationshipSelectorRow = withStyles(styles)(RelationshipSelectorRowPlain);
