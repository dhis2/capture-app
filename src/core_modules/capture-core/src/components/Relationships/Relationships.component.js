// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconButton, withStyles } from '@material-ui/core';
import { ArrowForward as ArrowIcon, Clear as ClearIcon } from '@material-ui/icons';
import Button from '../Buttons/Button.component';
import type { Relationship, Entity } from './relationships.types';

type Props = {
    classes: {
        container: string,
        relationshipsContainer: string,
        relationship: string,
        relationshipDetails: string,
        relationshipTypeName: string,
        relationshipEntities: string,
        arrowIcon: string,
        relationshipActions: string,
    },
    relationships: Array<Relationship>,
    onRemoveRelationship: (relationshipClientId: string) => void,
    onOpenAddRelationship: () => void,
    currentEntityId: string,
};


const getStyles = (theme: Theme) => ({
    relationship: {
        display: 'flex',
        alignItems: 'center',
        padding: 5,
    },
    relationshipDetails: {
        backgroundColor: theme.palette.grey.lighter,
        padding: 7,
        flexGrow: 1,
    },
    relationshipTypeName: {
        fontSize: 14,
        fontWeight: 600,
        color: 'rgba(0,0,0,0.7)',
    },
    relationshipsContainer: {
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    relationshipEntities: {
        marginTop: 7,
        fontSize: 15,
        display: 'flex',
        alignItems: 'center',
    },
    arrowIcon: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 15,
    },
    relationshipActions: {
        padding: 7,
    },
});

const fromNames = {
    PROGRAM_STAGE_INSTANCE: i18n.t('This event'),
};

class Relationships extends React.Component<Props> {
    getRelationships = () => {
        const { classes, relationships, onRemoveRelationship } = this.props;
        return relationships.map(r => (
            <div className={classes.relationship} key={r.id || r.clientId}>
                <div className={classes.relationshipDetails}>
                    <div className={classes.relationshipTypeName}>
                        {r.relationshipType.name}
                    </div>
                    <div className={classes.relationshipEntities}>
                        {this.getEntityName(r.from)}
                        <ArrowIcon className={classes.arrowIcon} />
                        {this.getEntityName(r.to)}
                    </div>
                </div>
                <div className={classes.relationshipActions}>
                    {this.canDelete(r) &&
                        <IconButton onClick={() => { onRemoveRelationship(r.clientId); }} >
                            <ClearIcon />
                        </IconButton>
                    }
                </div>
            </div>
        ),
        );
    }

    getEntityName = (entity: Entity) =>
        (entity.id === this.props.currentEntityId ?
            fromNames[entity.type] : entity.name);

    canDelete = (relationship: Relationship) => relationship.from.id === this.props.currentEntityId;

    render() {
        const { classes, onOpenAddRelationship } = this.props;
        return (
            <div className={classes.container}>
                <div className={classes.relationshipsContainer}>
                    {this.getRelationships()}
                </div>
                <div>
                    <Button onClick={onOpenAddRelationship}>
                        {i18n.t('Add relationship')}
                    </Button>
                </div>

            </div>
        );
    }
}

export default withStyles(getStyles)(Relationships);
