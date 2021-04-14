// @flow
import { connect } from 'react-redux';
import { eventCancelNewRelationship, requestAddEventRelationship } from './ViewEventRelationships.actions';
import { ViewEventNewRelationshipWrapperComponent } from './ViewEventNewRelationshipWrapper.component';
import { makeRelationshipTypesSelector } from './ViewEventNewRelationshipWrapper.selectors';

const makeMapStateToProps = () => {
    const relationshipTypesSelector = makeRelationshipTypesSelector();

    const mapStateToProps = (state: ReduxState) => {
        const relationshipTypes = relationshipTypesSelector(state);

        return {
            relationshipTypes,
        };
    };


    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onCancel: () => {
        dispatch(eventCancelNewRelationship());
    },
    onAddRelationship: (relationshipType: { id: string, name: string}, entity: Object, entityType: string) => {
        dispatch(requestAddEventRelationship(relationshipType, entity, entityType));
    },
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const ViewEventNewRelationshipWrapper = connect(makeMapStateToProps, mapDispatchToProps)(
    ViewEventNewRelationshipWrapperComponent,
);
