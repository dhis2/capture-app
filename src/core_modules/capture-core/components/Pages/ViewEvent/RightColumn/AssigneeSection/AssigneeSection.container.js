// @flow
import { connect } from 'react-redux';
import { setAssignee } from './assigneeSection.actions';
import { AssigneeSectionComponent } from './AssigneeSection.component';

const mapStateToProps = (state: ReduxState) => {
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
// $FlowFixMe[missing-annot] automated comment
export const AssigneeSection = connect(mapStateToProps, mapDispatchToProps)(AssigneeSectionComponent);
