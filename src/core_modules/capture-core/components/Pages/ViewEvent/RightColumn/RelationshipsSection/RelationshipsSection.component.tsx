import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconLink24, colors, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import type { ComponentType } from 'react';
import { ViewEventSection } from '../../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../../Section/ViewEventSectionHeader.component';
import { Relationships } from '../../../../Relationships/Relationships.component';
import { withLoadingIndicator } from '../../../../../HOC/withLoadingIndicator';
import { ConnectedEntity } from './ConnectedEntity';
import type { Entity } from '../../../../Relationships/relationships.types';
import type { PlainProps } from './RelationshipsSection.types';

const LoadingRelationships =
    withLoadingIndicator(null, props => ({ style: props.loadingIndicatorStyle }))(Relationships);

const headerText = i18n.t('Relationships');

const getStyles = (theme: any) => ({
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
    emptyMessage: {
        fontSize: 14,
        color: colors.grey600,
        paddingBottom: spacersNum.dp8,
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
        const badgeCount = ready ? count : undefined;
        return (
            <ViewEventSectionHeader
                icon={IconLink24}
                text={headerText}
                badgeClass={classes.badge}
                badgeCount={badgeCount}
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
                type={entity.type}
                name={entity.name}
                id={entity.id}
                orgUnitId={orgUnitId}
                linkProgramId={(entity as any).linkProgramId}
            />
        );
    }

    render() {
        const { classes, programStage, eventId, relationships, ready, readOnly } = this.props;
        const relationshipTypes = programStage.relationshipTypes || [];
        const hasRelationshipTypes = relationshipTypes.length > 0;

        const writableRelationshipTypes =
            programStage.relationshipTypesWhereStageIsFrom.filter(rt => rt.access.data.write);

        const isEmpty = ready && (!relationships || relationships.length === 0);

        return hasRelationshipTypes && (
            <ViewEventSection
                collapsable
                header={this.renderHeader()}
            >
                {isEmpty && (
                    <div className={classes.emptyMessage} data-test="relationships-empty-message">
                        {i18n.t("This event doesn't have any relationships")}
                    </div>
                )}
                {React.createElement(LoadingRelationships as any, {
                    ready,
                    relationships,
                    writableRelationshipTypes,
                    onOpenAddRelationship: this.handleOpenAddRelationship,
                    onRemoveRelationship: this.handleRemoveRelationship,
                    currentEntityId: eventId,
                    readOnly,
                    smallMainButton: true,
                    onRenderConnectedEntity: this.renderConnectedEntity,
                })}
            </ViewEventSection>
        );
    }
}

export const RelationshipsSectionComponent = withStyles(getStyles)(RelationshipsSectionPlain) as ComponentType<PlainProps>;
