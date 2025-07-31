import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconLink24 } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { Theme } from '@material-ui/core/styles';
import { ViewEventSection } from '../../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../../Section/ViewEventSectionHeader.component';
import { Relationships } from '../../../../Relationships/Relationships.component';
import { withLoadingIndicator } from '../../../../../HOC/withLoadingIndicator';
import { ConnectedEntity } from './ConnectedEntity';
import type { Entity } from '../../../../Relationships/relationships.types';
import type { PlainProps } from './RelationshipsSection.types';

const LoadingRelationships =
    withLoadingIndicator(null, props => ({ style: props.loadingIndicatorStyle }))(Relationships);

const loadingIndicatorStyle = {
    height: 36,
    width: 36,
};

const headerText = i18n.t('Relationships');

const getStyles = (theme: Theme) => ({
    badge: {
        backgroundColor: theme.palette.grey[300],
    },
    relationship: {
        marginTop: theme.typography.pxToRem(5),
        marginBottom: theme.typography.pxToRem(5),
        padding: theme.typography.pxToRem(10),
        borderRadius: theme.typography.pxToRem(4),
        backgroundColor: theme.palette.grey[100],
    },
});

type Props = PlainProps & WithStyles<typeof getStyles>;

class RelationshipsSectionPlain extends React.Component<Props> {
    handleOpenAddRelationship = () => {
        this.props.onOpenAddRelationship();
    }

    handleRemoveRelationship = (clientId: string) => {
        this.props.onDeleteRelationship(clientId);
    }

    renderHeader = () => {
        const { classes, relationships, ready } = this.props;
        const count = relationships ? relationships.length : 0;
        const displayCount = ready ? count : null;
        return (
            <ViewEventSectionHeader
                icon={IconLink24}
                text={headerText}
                badgeClass={classes.badge}
                badgeCount={displayCount}
            />
        );
    }

    renderItems = (relationships: Array<any>) => relationships.map(relationship => (
        <div className={this.props.classes.relationship}>{relationship}</div>
    ))

    renderConnectedEntity = (entity: Entity) => {
        const { orgUnitId } = this.props;
        return (
            <ConnectedEntity
                entityType={entity.type}
                orgUnitId={orgUnitId}
                {...entity}
            />
        );
    }

    render() {
        const { programStage, eventId, relationships, ready, eventAccess } = this.props;
        const relationshipTypes = programStage.relationshipTypes || [];
        const hasRelationshipTypes = relationshipTypes.length > 0;

        const writableRelationshipTypes =
            programStage.relationshipTypesWhereStageIsFrom.filter(rt => rt.access.data.write);

        return hasRelationshipTypes && (
            <ViewEventSection
                collapsable
                header={this.renderHeader()}
            >
                <LoadingRelationships
                    loadingIndicatorStyle={loadingIndicatorStyle}
                    ready={ready}
                    relationships={relationships}
                    writableRelationshipTypes={writableRelationshipTypes}
                    onOpenAddRelationship={this.handleOpenAddRelationship}
                    onRemoveRelationship={this.handleRemoveRelationship}
                    currentEntityId={eventId}
                    entityAccess={eventAccess}
                    smallMainButton
                    onRenderConnectedEntity={this.renderConnectedEntity}
                />
            </ViewEventSection>
        );
    }
}

export const RelationshipsSectionComponent = withStyles(getStyles)(RelationshipsSectionPlain);
