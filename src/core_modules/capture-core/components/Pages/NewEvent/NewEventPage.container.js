// @flow
import { connect } from 'react-redux';
import NewEventPage from './NewEventPage.component';
import dataEntryHasChanges from '../../DataEntry/common/dataEntryHasChanges';

const mapStateToProps = (state: ReduxState) => {
    const formInputInProgess = state.currentSelections.complete && dataEntryHasChanges(state, 'singleEvent-newEvent');
    const inAddRelationship = state.newEventPage.showAddRelationship;
    return {
        isSelectionsComplete: !!state.currentSelections.complete,
        formInputInProgess,
        inAddRelationship,
    };
};

const mapDispatchToProps = () => ({
});
// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(NewEventPage);
