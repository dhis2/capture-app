// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Link as LinkIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core';
import ViewEventSection from '../../Section/ViewEventSection.component';
import ViewEventSectionHeader from '../../Section/ViewEventSectionHeader.component';
import Relationships from '../../../../Relationships/Relationships.component';
import { ProgramStage } from '../../../../../metaData';
import withLoadingIndicator from '../../../../../HOC/withLoadingIndicator';
import { ConnectedEntity } from './ConnectedEntity';
import type { Entity } from '../../../../Relationships/relationships.types';

const LoadingRelationships =
    withLoadingIndicator(null, props => ({ style: props.loadingIndicatorStyle }))(Relationships);

type Props = {
    classes: Object,
    relationships: ?Array<any>,
    onOpenAddRelationship: () => void,
    onDeleteRelationship: (clientId: string) => void,
    eventId: string,
    programStage: ProgramStage,
    ready: boolean,
    eventAccess: any,
    orgUnitId: string,
}

const loadingIndicatorStyle = {
    height: 36,
    width: 36,
};

const headerText = i18n.t('Relationships');

const getStyles = (theme: Theme) => ({
    badge: {
        backgroundColor: theme.palette.grey.light,
    },
    relationship: {
        marginTop: theme.typography.pxToRem(5),
        marginBottom: theme.typography.pxToRem(5),
        padding: theme.typography.pxToRem(10),
        borderRadius: theme.typography.pxToRem(4),
        backgroundColor: theme.palette.grey.lighter,
    },
});

class RelationshipsSection extends React.Component<Props> {
    renderHeader = () => {
        const { classes, relationships, ready } = this.props;
        let count = relationships ? relationships.length : 0;
        count = ready ? count : null;
        return (
            <ViewEventSectionHeader
                icon={LinkIcon}
                text={headerText}
                badgeClass={classes.badge}
                badgeCount={count}
            />
        );
    }

    handleOpenAddRelationship = () => {
        this.props.onOpenAddRelationship();
    }

    handleRemoveRelationship = (clientId: string) => {
        this.props.onDeleteRelationship(clientId);
    }

    renderItems = (relationships: Array<any>) => relationships.map(relationship => (
        <div className={this.props.classes.relationship}>{relationship}</div>
    ))

    renderConnectedEntity = (entity: Entity) => {
        const { orgUnitId } = this.props;
        return (
            <ConnectedEntity
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

export default withStyles(getStyles)(RelationshipsSection);
