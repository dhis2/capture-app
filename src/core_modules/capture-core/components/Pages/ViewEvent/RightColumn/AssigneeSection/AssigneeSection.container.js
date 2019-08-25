// @flow
import { connect } from 'react-redux';
import AssigneeSection from './AssigneeSection.component';
import { setAssignee } from './assigneeSection.actions';

const mapStateToProps = (state: ReduxState, props: Object) => {
    const assigneeSection = state.viewEventPage.assigneeSection || {};

    return {
        assignee: (!assigneeSection.isLoading) ?
            state.viewEventPage.loadedValues.eventContainer.event.assignee :
            undefined,
        ready: !assigneeSection.isLoading,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSet: (user: Object) => {
        dispatch(setAssignee(user));
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(AssigneeSection);
