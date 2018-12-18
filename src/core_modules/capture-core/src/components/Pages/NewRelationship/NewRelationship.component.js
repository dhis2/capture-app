// @flow
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import RelationshipTypeSelector from './RelationshipTypeSelector/RelationshipTypeSelector.component';
import TeiRelationship from './TeiRelationship/TeiRelationship.container';
import RelationshipType from '../../../metaData/RelationshipType/RelationshipType';


type Props = {
    onAddRelationship: (relationshipTypeId: string, entityId: string, entityType: string) => void,
    classes: {
        container: string,
    },
    selectedRelationshipType: ?RelationshipType,
}

const getStyles = theme => ({
    container: {

    },
});

const relationshipComponentByEntityType = {
    TRACKED_ENTITY_INSTANCE: TeiRelationship,
};

class NewRelationship extends React.Component<Props> {
    renderRelationship = (selectedRelationshipType: RelationshipType, props: Object) => {
        const RelationshipComponent = relationshipComponentByEntityType[selectedRelationshipType.to.entity];
        return (
            <RelationshipComponent
                onAddRelationship={this.handleAddRelationship}
                {...props}
            />
        );
    }

    handleAddRelationship = (entityId: string) => {
        const relationshipType = this.props.selectedRelationshipType;
        if (!relationshipType) {
            return;
        }

        this.props.onAddRelationship(relationshipType.id, entityId, relationshipType.to.entity);
    }

    render() {
        const { classes, onAddRelationship, ...passOnProps } = this.props;
        const selectedRelationshipType = this.props.selectedRelationshipType;
        return (
            <div className={this.props.classes.container}>
                <RelationshipTypeSelector
                    {...passOnProps}
                />
                {selectedRelationshipType && this.renderRelationship(selectedRelationshipType, passOnProps)}
            </div>
        );
    }
}

export default withStyles(getStyles)(NewRelationship);
