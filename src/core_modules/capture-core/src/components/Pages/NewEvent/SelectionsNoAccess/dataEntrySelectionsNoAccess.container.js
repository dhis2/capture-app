// @flow
import { connect } from 'react-redux';
import DataEntrySelectionsNoAccess from './dataEntrySelectionsNoAccess.component';
import {
    cancelNewEventAndReturnToMainPage,
} from '../DataEntry/actions/dataEntry.actions';

const mapStateToProps = (state: ReduxState) => ({
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onCancel: () => {
        dispatch(cancelNewEventAndReturnToMainPage());
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(DataEntrySelectionsNoAccess);
