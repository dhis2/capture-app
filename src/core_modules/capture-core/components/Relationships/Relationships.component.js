// @flow

import * as React from 'react';
import classNames from 'classnames';
import i18n from '@dhis2/d2-i18n';
import { IconButton, withStyles } from '@material-ui/core';
import { IconArrowRight16, IconCross24, Button } from '@dhis2/ui';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import type { RelationshipType } from '../../metaData';
import type { Relationship, Entity } from './relationships.types';

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
    '@keyframes background-fade': {
        '0%': {
            backgroundColor: theme.palette.secondary.lightest,
        },
        '70%': {
            backgroundColor: theme.palette.secondary.lightest,
        },
        '100%': {
            backgroundColor: theme.palette.grey.lighter,
        },
    },
    relationshipHighlight: {
        animation: 'background-fade 2.5s forwards',
    },
    tooltip: {
        display: 'inline-flex',
        borderRadius: '100%',
    },
});

const fromNames = {
    PROGRAM_STAGE_INSTANCE: i18n.t('This event'),
};

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
        relationshipHighlight: string,
        tooltip: string,
        addButtonContainer: string,
    },
    relationships: Array<Relationship>,
    highlightRelationshipId?: ?string,
    writableRelationshipTypes: Array<RelationshipType>,
    entityAccess: { read: boolean, write: boolean },
    onRemoveRelationship: (relationshipClientId: string) => void,
    onOpenAddRelationship: () => void,
    onRenderConnectedEntity: (entity: Entity) => React.Node,
    currentEntityId: string,
    smallMainButton: boolean,
};

class RelationshipsPlain extends React.Component<Props> {
    static defaultProps = {
        entityAccess: { read: true, write: true },
    }


    shouldComponentUpdate(nextProps: Props) {
        const changes = Object.keys(nextProps).filter(propName => nextProps[propName] !== this.props[propName]);
        const numberOfChanges = changes.length;

        if (
            numberOfChanges === 1 &&
            changes[0] === 'highlightRelationshipId' &&
            !nextProps.highlightRelationshipId
        ) {
            return false;
        }
        return numberOfChanges > 0;
    }

    renderRelationships = () => this.props.relationships.map(relationship => relationship &&
        this.renderRelationship(relationship))

    renderRelationship = (relationship: Relationship) => {
        const { classes, onRemoveRelationship } = this.props;
        const canDelete = this.canDelete(relationship);
        const relationshipDetailsClass = classNames(classes.relationshipDetails, {
            [classes.relationshipHighlight]: this.shouldHighlightRelationship(relationship),
        });
        return (
            <div className={classes.relationship} key={relationship.clientId}>
                <div className={relationshipDetailsClass}>
                    <div className={classes.relationshipTypeName}>
                        {relationship.relationshipType.name}
                    </div>
                    <div className={classes.relationshipEntities}>
                        {this.getEntityName(relationship.from)}
                        <span className={classes.arrowIcon}> <IconArrowRight16 /> </span>
                        {this.getEntityName(relationship.to)}
                    </div>
                </div>
                <div className={classes.relationshipActions}>
                    <ConditionalTooltip
                        content={i18n.t('You don\'t have access to delete this relationship')}
                        enabled={!canDelete}
                        wrapperClassName={classes.tooltip}
                    >
                        <IconButton
                            data-test="delete-relationship-button"
                            onClick={() => { onRemoveRelationship(relationship.clientId); }}
                            disabled={!canDelete}
                        >
                            <IconCross24 />
                        </IconButton>
                    </ConditionalTooltip>
                </div>
            </div>
        );
    }

    shouldHighlightRelationship = (relationship: Relationship) => {
        const highlightRelationshipId = this.props.highlightRelationshipId;
        return highlightRelationshipId && highlightRelationshipId === relationship.clientId;
    }

    getEntityName = (entity: Entity) => {
        const { onRenderConnectedEntity } = this.props;

        if (entity.id === this.props.currentEntityId) {
            return fromNames[entity.type];
        }

        return onRenderConnectedEntity ? onRenderConnectedEntity(entity) : entity.name;
    }

    canDelete = (relationship: Relationship) => {
        const { entityAccess, writableRelationshipTypes } = this.props;
        return (
            relationship.from.id === this.props.currentEntityId &&
            entityAccess.write &&
            writableRelationshipTypes.some(rt => rt.id === relationship.relationshipType.id && rt.access.data.write)
        );
    }

    render() {
        // $FlowFixMe[prop-missing] automated comment
        const { classes, onOpenAddRelationship, entityAccess, writableRelationshipTypes, relationshipsRef, smallMainButton } = this.props;
        const canCreate = entityAccess.write && writableRelationshipTypes.length > 0;
        return (
            <div className={classes.container} ref={relationshipsRef}>
                <div className={classes.relationshipsContainer}>
                    {this.renderRelationships()}
                </div>
                <div>
                    <div
                        className={classes.addButtonContainer}
                    >
                        <ConditionalTooltip
                            content={i18n.t('You don\'t have access to create any relationships')}
                            enabled={!canCreate}
                        >
                            <Button
                                onClick={onOpenAddRelationship}
                                disabled={!canCreate}
                                small={smallMainButton}
                                dataTest="add-relationship-button"
                            >
                                {i18n.t('Add relationship')}
                            </Button>
                        </ConditionalTooltip>
                    </div>
                </div>
            </div>
        );
    }
}

export const Relationships = withStyles(getStyles)(RelationshipsPlain);
