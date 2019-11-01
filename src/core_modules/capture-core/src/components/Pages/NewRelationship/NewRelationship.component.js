// @flow
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import RelationshipTypeSelector from './RelationshipTypeSelector/RelationshipTypeSelector.component';
import TeiRelationship from './TeiRelationship/TeiRelationship.component';
import type { SelectedRelationshipType } from './newRelationship.types';
import RelationshipNavigation from './RelationshipNavigation/RelationshipNavigation.container';


type Props = {
    onAddRelationship: (relationshipType: { id: string, name: string }, entity: Object, entityType: string) => void,
    classes: {
        container: string,
    },
    selectedRelationshipType: ?SelectedRelationshipType,
}

const getStyles = theme => ({
    container: {

    },
});

const relationshipComponentByEntityType = {
    TRACKED_ENTITY_INSTANCE: TeiRelationship,
};

class NewRelationship extends React.Component<Props> {
    renderRelationship = (selectedRelationshipType: SelectedRelationshipType, props: Object) => {
        const RelationshipComponent = relationshipComponentByEntityType[selectedRelationshipType.to.entity];
        return (
            <RelationshipComponent
                onAddRelationship={this.handleAddRelationship}
                {...props}
            />
        );
    }

    handleAddRelationship = (entity: Object) => {
        const relationshipType = this.props.selectedRelationshipType;
        if (!relationshipType) {
            return;
        }

        this.props.onAddRelationship({ id: relationshipType.id, name: relationshipType.name }, entity, relationshipType.to.entity);
    }

    render() {
        const { classes, onAddRelationship, ...passOnProps } = this.props;
        const selectedRelationshipType = this.props.selectedRelationshipType;
        return (
            <div className={this.props.classes.container}>
                <RelationshipNavigation
                    {...passOnProps}
                />
                { !selectedRelationshipType && <RelationshipTypeSelector
                    {...passOnProps}
                />
                }
                {selectedRelationshipType && this.renderRelationship(selectedRelationshipType, passOnProps)}
            </div>
        );
    }
}

export default withStyles(getStyles)(NewRelationship);
