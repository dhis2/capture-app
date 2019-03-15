// @flow
import { connect } from 'react-redux';
import DataEntrySelectionsNoAccess from './dataEntrySelectionsNoAccess.component';
import { cancelNewEventFromSelectionsNoAccessAndReturnToMainPage } from './dataEntrySelectionsNoAccess.actions';

const mapStateToProps = (state: ReduxState) => ({
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onCancel: () => {
        dispatch(cancelNewEventFromSelectionsNoAccessAndReturnToMainPage());
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(DataEntrySelectionsNoAccess);
