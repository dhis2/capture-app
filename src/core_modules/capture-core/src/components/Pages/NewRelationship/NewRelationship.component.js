// @flow
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import RelationshipTypeSelector from './RelationshipTypeSelector/RelationshipTypeSelector.component';
import TeiRelationship from './TeiRelationship/TeiRelationship.component';
import RelationshipType from '../../../metaData/RelationshipType/RelationshipType';

type Props = {
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
                {...props}
            />
        );
    }

    render() {
        const { classes, ...passOnProps } = this.props;
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
