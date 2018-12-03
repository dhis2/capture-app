// @flow
import { connect } from 'react-redux';
import { newEventCancelNewRelationship } from './NewEventNewRelationshipWrapper.actions';
import NewRelationshipWrapper from './NewEventNewRelationshipWrapper.component';
import { makeRelationshipTypesSelector } from './NewEventNewRelationshipWrapper.selectors';

const makeMapStateToProps = () => {
    const relationshipTypesSelector = makeRelationshipTypesSelector();

    const mapStateToProps = (state: ReduxState) => {
        const relationshipTypes = relationshipTypesSelector(state);

        return {
            relationshipTypes,
        };
    };

    // $FlowSuppress
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onCancel: (formHorizontal: boolean) => {
        dispatch(newEventCancelNewRelationship());
    },
});

// $FlowSuppress
export default connect(makeMapStateToProps, mapDispatchToProps)(NewRelationshipWrapper);
