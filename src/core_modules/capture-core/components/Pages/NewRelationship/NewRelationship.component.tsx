import * as React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { RelationshipTypeSelector } from './RelationshipTypeSelector/RelationshipTypeSelector.component';
import { TeiRelationship } from './TeiRelationship/TeiRelationship.component';
import type { SelectedRelationshipType } from './newRelationship.types';
import { RelationshipNavigation } from './RelationshipNavigation/RelationshipNavigation.container';
import { findModes } from './findModes';

type OwnProps = {
    onAddRelationship: (relationshipType: { id: string; name: string }, entity: any, entityType: string) => void;
    onCancel: () => void;
    selectedRelationshipType?: SelectedRelationshipType;
    onInitializeNewRelationship: () => void;
    onSelectRelationshipType: (selectedRelationshipType: SelectedRelationshipType) => void;
    onDeselectRelationshipType: () => void;
    onSelectFindMode: (findMode: typeof findModes[keyof typeof findModes]) => void;
    header: any;
    relationshipTypes?: Array<any>;
};

type Props = OwnProps & WithStyles<typeof getStyles>;

const getStyles = () => ({
    container: {

    },
});

const relationshipComponentByEntityType = {
    TRACKED_ENTITY_INSTANCE: TeiRelationship,
};

class NewRelationshipPlain extends React.Component<Props> {
    handleAddRelationship = (entity: any) => {
        const relationshipType = this.props.selectedRelationshipType;
        if (!relationshipType) {
            return;
        }

        this.props.onAddRelationship(
            { id: relationshipType.id, name: relationshipType.name },
            entity,
            relationshipType.to.entity,
        );
    }

    renderRelationship = (selectedRelationshipType: SelectedRelationshipType, props: any) => {
        const RelationshipComponent = relationshipComponentByEntityType[selectedRelationshipType.to.entity];
        return (
            <RelationshipComponent
                onAddRelationship={this.handleAddRelationship}
                {...props}
            />
        );
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

export const NewRelationshipComponent = withStyles(getStyles)(NewRelationshipPlain);
