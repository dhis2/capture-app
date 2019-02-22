// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Link as LinkIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core';
import ViewEventSection from '../../Section/ViewEventSection.component';
import ViewEventSectionHeader from '../../Section/ViewEventSectionHeader.component';
import Relationships from '../../../../Relationships/Relationships.component';
import { ProgramStage } from '../../../../../metaData';


type Props = {
    classes: Object,
    relationships: ?Array<any>,
    onOpenAddRelationship: () => void,
    eventId: string,
    programStage: ProgramStage,
}

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
        const { classes, relationships } = this.props;
        const count = relationships ? relationships.length : 0;
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

    handleRemoveRelationship = (id: string) => {

    }

    renderItems = (relationships: Array<any>) => relationships.map(relationship => (
        <div className={this.props.classes.relationship}>{relationship}</div>
    ))
    render() {
        const { programStage } = this.props;

        const hasRelationshipTypes = programStage.relationshipTypes && programStage.relationshipTypes.length > 0;

        return hasRelationshipTypes && (
            <ViewEventSection
                collapsable
                header={this.renderHeader()}
            >
                <Relationships
                    relationships={this.props.relationships}
                    onOpenAddRelationship={this.handleOpenAddRelationship}
                    onRemoveRelationship={this.handleRemoveRelationship}
                    currentEntityId={this.props.eventId}
                />
            </ViewEventSection>
        );
    }
}

export default withStyles(getStyles)(RelationshipsSection);
