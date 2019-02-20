// @flow
import { connect } from 'react-redux';
import SelectionsComplete from './SelectionsComplete.component';


const mapStateToProps = (state: ReduxState) => ({
    showAddRelationship: !!state.newEventPage.showAddRelationship,
});

const mapDispatchToProps = () => ({
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(SelectionsComplete);
