// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconButton, withStyles, Tooltip } from '@material-ui/core';
import { ArrowForward as ArrowIcon, Clear as ClearIcon } from '@material-ui/icons';
import Button from '../Buttons/Button.component';
import { RelationshipType } from '../../metaData';
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
    writableRelationshipTypes: Array<RelationshipType>,
    entityAccess: { read: boolean, write: boolean },
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
    addButtonContainer: {
        display: 'inline-block',
    },
});

const fromNames = {
    PROGRAM_STAGE_INSTANCE: i18n.t('This event'),
};

class Relationships extends React.Component<Props> {
    static defaultProps = {
        entityAccess: { read: true, write: true },
    }

    renderRelationships = () => this.props.relationships.map(r => this.renderRelationship(r))

    renderRelationship = (relationship: Relationship) => {
        const { classes, onRemoveRelationship } = this.props;
        const canDelete = this.canDelete(relationship);
        return (
            <div className={classes.relationship} key={relationship.clientId}>
                <div className={classes.relationshipDetails}>
                    <div className={classes.relationshipTypeName}>
                        {relationship.relationshipType.name}
                    </div>
                    <div className={classes.relationshipEntities}>
                        {this.getEntityName(relationship.from)}
                        <ArrowIcon className={classes.arrowIcon} />
                        {this.getEntityName(relationship.to)}
                    </div>
                </div>
                <div className={classes.relationshipActions}>
                    <Tooltip title={canDelete ? '' : i18n.t('You dont have access to delete this relationship')}>
                        <div>
                            <IconButton
                                onClick={() => { onRemoveRelationship(relationship.clientId); }}
                                disabled={!canDelete}
                            >
                                <ClearIcon />
                            </IconButton>
                        </div>
                    </Tooltip>
                </div>
            </div>
        );
    }

    getEntityName = (entity: Entity) =>
        (entity.id === this.props.currentEntityId ?
            fromNames[entity.type] : entity.name);

    canDelete = (relationship: Relationship) => {
        const { entityAccess, writableRelationshipTypes } = this.props;
        return (
            relationship.from.id === this.props.currentEntityId &&
            entityAccess.write &&
            writableRelationshipTypes.some(rt => rt.id === relationship.relationshipType.id && rt.access.data.write)
        );
    }

    render() {
        const { classes, onOpenAddRelationship, entityAccess, writableRelationshipTypes } = this.props;
        const canCreate = entityAccess.write && writableRelationshipTypes.length > 0;
        return (
            <div className={classes.container}>
                <div className={classes.relationshipsContainer}>
                    {this.renderRelationships()}
                </div>
                <div>
                    <Tooltip title={canCreate ? '' : i18n.t('You dont have access to create any relationships')}>
                        <div className={classes.addButtonContainer}>
                            <Button
                                onClick={onOpenAddRelationship}
                                disabled={!canCreate}
                            >
                                {i18n.t('Add relationship')}
                            </Button>
                        </div>
                    </Tooltip>
                </div>

            </div>
        );
    }
}

export default withStyles(getStyles)(Relationships);
