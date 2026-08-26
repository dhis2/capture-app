import * as React from 'react';
import { cx } from '@emotion/css';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { IconButton } from 'capture-ui';
import { IconDelete16, Button, colors } from '@dhis2/ui';
import { DirectionalArrow } from '../../utils/rtl';
import type { RelationshipType } from '../../metaData';
import type { Relationship, Entity } from './relationships.types';

const styles: Readonly<any> = (theme: any) => ({
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
        color: colors.grey700,
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
        marginInlineStart: 10,
        marginInlineEnd: 10,
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
});

const fromNames = {
    PROGRAM_STAGE_INSTANCE: i18n.t('This event'),
};

type PlainProps = {
    relationships: Array<Relationship>;
    highlightRelationshipId?: string;
    writableRelationshipTypes: Array<RelationshipType>;
    readOnly?: boolean;
    onRemoveRelationship: (relationshipClientId: string) => void;
    onOpenAddRelationship: () => void;
    onRenderConnectedEntity: (entity: Entity) => React.ReactNode;
    currentEntityId: string;
    smallMainButton: boolean;
    relationshipsRef: (instance: any) => void;
};

type Props = PlainProps & WithStyles<typeof styles>;

class RelationshipsPlain extends React.Component<Props> {
    static defaultProps = {
        readOnly: false,
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

    getEntityName = (entity: Entity) => {
        const { onRenderConnectedEntity } = this.props;

        if (entity.id === this.props.currentEntityId) {
            return fromNames[entity.type];
        }

        return onRenderConnectedEntity ? onRenderConnectedEntity(entity) : entity.name;
    }

    shouldHighlightRelationship = (relationship: Relationship) => {
        const highlightRelationshipId = this.props.highlightRelationshipId;
        return highlightRelationshipId && highlightRelationshipId === relationship.clientId;
    }

    canDelete = (relationship: Relationship) => {
        const { readOnly, writableRelationshipTypes } = this.props;
        return (
            !readOnly &&
            relationship.from.id === this.props.currentEntityId &&
            writableRelationshipTypes.some(rt => rt.id === relationship.relationshipType.id && rt.access.data.write)
        );
    }

    renderRelationship = (relationship: Relationship) => {
        const { classes, onRemoveRelationship } = this.props;
        const canDelete = this.canDelete(relationship);
        const relationshipDetailsClass = cx(classes.relationshipDetails, {
            [classes.relationshipHighlight]: Boolean(this.shouldHighlightRelationship(relationship)),
        });
        return (
            <div className={classes.relationship} key={relationship.clientId}>
                <div className={relationshipDetailsClass}>
                    <div className={classes.relationshipTypeName}>
                        {relationship.relationshipType.name}
                    </div>
                    <div className={classes.relationshipEntities}>
                        {this.getEntityName(relationship.from)}
                        <span className={classes.arrowIcon}> <DirectionalArrow /> </span>
                        {this.getEntityName(relationship.to)}
                    </div>
                </div>
                {canDelete && (
                    <div className={classes.relationshipActions}>
                        <IconButton
                            dataTest="delete-relationship-button"
                            onClick={() => { onRemoveRelationship(relationship.clientId); }}
                            secondary
                        >
                            <IconDelete16 />
                        </IconButton>
                    </div>
                )}
            </div>
        );
    }

    renderRelationships = () => this.props.relationships.map(relationship => relationship &&
        this.renderRelationship(relationship))

    render() {
        const {
            classes,
            onOpenAddRelationship,
            readOnly,
            writableRelationshipTypes,
            relationshipsRef,
            smallMainButton,
        } = this.props;
        const canCreate = !readOnly && writableRelationshipTypes.length > 0;
        return (
            <div className={classes.container} ref={relationshipsRef}>
                <div className={classes.relationshipsContainer}>
                    {this.renderRelationships()}
                </div>
                {canCreate && (
                    <div>
                        <div className={classes.addButtonContainer}>
                            <Button
                                onClick={onOpenAddRelationship}
                                small={smallMainButton}
                                dataTest="add-relationship-button"
                                secondary
                            >
                                {i18n.t('Add relationship')}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export const Relationships = withStyles(styles)(RelationshipsPlain);
