// @flow
import { Button, spacers } from '@dhis2/ui';
import React, { useMemo } from 'react';
import { withStyles } from '@material-ui/core';

const styles = {
    container: {
        padding: spacers.dp16,
        paddingTop: 0,
    },
    typeselector: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp8,
        marginBottom: spacers.dp16,
    },
    dualButtonContainer: {
        display: 'flex',
        gap: spacers.dp8,
    },
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
};

const RelationshipTypeSelectorPlain = ({ relationshipTypes, trackedEntityType, programId, onSelectType, classes }) => useMemo(() => {
    const renderButtons = (relationship) => {
        const defaultButton = (
            <Button
                onClick={() => onSelectType(relationship.id)}
                secondary
            >
                {relationship.fromToName}
            </Button>
        );

        const { fromConstraint, toConstraint } = relationship;
        if (relationship.bidirectional) {
            if (relationship.fromConstraint.trackedEntityType?.id === trackedEntityType && relationship.toConstraint.trackedEntityType?.id === trackedEntityType) {
                let fromConstraintValid = true;
                let toConstraintValid = true;
                if (fromConstraint.program) {
                    if ((fromConstraint.program?.id !== programId) || (fromConstraint?.trackedEntityType.id !== trackedEntityType)) {
                        fromConstraintValid = false;
                    }
                }
                if (toConstraint.program) {
                    if ((toConstraint.program?.id !== programId) || (toConstraint?.trackedEntityType.id !== trackedEntityType)) {
                        toConstraintValid = false;
                    }
                }

                return (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {fromConstraintValid && (
                            <Button
                                onClick={() => onSelectType(relationship.id)}
                                secondary
                            >
                                {relationship.fromToName}
                            </Button>
                        )}
                        {toConstraintValid && (
                            <Button
                                onClick={() => onSelectType(relationship.id)}
                                secondary
                            >
                                {relationship.toFromName}
                            </Button>
                        )}
                    </div>
                );
            }
            if (relationship.fromConstraint.trackedEntityType?.id === trackedEntityType) {
                return defaultButton;
            }
            if (relationship.toConstraint.trackedEntityType?.id === trackedEntityType) {
                return (
                    <Button
                        onClick={() => onSelectType(relationship.id)}
                        secondary
                    >
                        {relationship.toFromName}
                    </Button>
                );
            }
        }

        return defaultButton;
    };

    return (
        <div className={classes.container}>
            <div className={classes.typeselector}>
                {relationshipTypes?.map(relationship => (
                    <div
                        key={relationship.id}
                        className={classes.selectorButton}
                    >
                        <div className={classes.title}>
                            {relationship.displayName}
                        </div>
                        <div>
                            {renderButtons(relationship)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}, [classes, onSelectType, programId, relationshipTypes, trackedEntityType]);

export const RelationshipTypeSelector = withStyles(styles)(RelationshipTypeSelectorPlain);
