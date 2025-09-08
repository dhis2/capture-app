import { connect } from 'react-redux';
import { eventCancelNewRelationship, requestAddEventRelationship } from './ViewEventRelationships.actions';
import { ViewEventNewRelationshipWrapperComponent } from './ViewEventNewRelationshipWrapper.component';
import { makeRelationshipTypesSelector } from './ViewEventNewRelationshipWrapper.selectors';

const makeMapStateToProps = () => {
    const relationshipTypesSelector = makeRelationshipTypesSelector();

    const mapStateToProps = (state: any) => {
        const relationshipTypes = relationshipTypesSelector(state);

        return {
            relationshipTypes,
        };
    };

    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: any) => ({
    onCancel: () => {
        dispatch(eventCancelNewRelationship());
    },
    onAddRelationship: (relationshipType: { id: string, name: string}, entity: any, entityType: string) => {
        dispatch(requestAddEventRelationship(relationshipType, entity, entityType));
    },
});

export const ViewEventNewRelationshipWrapper = connect(makeMapStateToProps, mapDispatchToProps)(
    ViewEventNewRelationshipWrapperComponent,
);
