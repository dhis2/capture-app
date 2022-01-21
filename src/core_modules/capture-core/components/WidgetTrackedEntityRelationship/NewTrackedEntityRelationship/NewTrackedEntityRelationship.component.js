import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, IconSearch24, IconAdd24, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { NewTEIRelationshipStatuses } from '../WidgetTrackedEntityRelationship.const';

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
    creationselector: {
        display: 'flex',
        gap: spacers.dp4,
    },
    selectorButton: {
        display: 'block',
    },
    cancelButton: {
        marginTop: spacers.dp8,
    },
};

const NewTrackedEntityRelationshipComponentPlain = ({ relationshipTypes, onSelectType, onCancel, pageStatus, classes }) => {
    if (pageStatus === NewTEIRelationshipStatuses.MISSING_RELATIONSHIP_TYPE) {
        return (
            <div className={classes.container}>
                <div className={classes.typeselector}>
                    {relationshipTypes?.map(relationship => (
                        <div
                            key={relationship.id}
                            className={classes.selectorButton}
                        >
                            <Button
                                onClick={() => onSelectType(relationship.id)}
                            >
                                {relationship.displayName}
                            </Button>
                        </div>
                    ))}
                </div>
                <Button onClick={onCancel}>{i18n.t('Cancel')}</Button>
            </div>
        );
    }

    if (pageStatus === NewTEIRelationshipStatuses.MISSING_CREATION_MODE) {
        return (
            <div className={classes.container}>
                <div className={classes.creationselector}>
                    <Button className={classes.creationselector}>
                        <IconSearch24 />
                        <p>{i18n.t('Link to an existing person')}</p>
                    </Button>
                    <Button className={classes.creationselector}>
                        <IconAdd24 />
                        <p>{i18n.t('Create new')}</p>
                    </Button>
                </div>
                <Button
                    className={classes.cancelButton}
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </div>
        );
    }

    return <p>{i18n.t('An error occurred')}</p>;
};

export const NewTrackedEntityRelationshipComponent = withStyles(styles)(NewTrackedEntityRelationshipComponentPlain);
