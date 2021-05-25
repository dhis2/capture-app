// @flow
import { connect } from 'react-redux';
import { DataEntrySelectionsNoAccess } from './dataEntrySelectionsNoAccess.component';
import {
    cancelNewEventAndReturnToMainPage,
} from '../DataEntryWrapper/DataEntry/actions/dataEntry.actions';

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onCancel: () => {
        dispatch(cancelNewEventAndReturnToMainPage());
    },
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export const SelectionsNoAccess = connect(mapStateToProps, mapDispatchToProps)(DataEntrySelectionsNoAccess);
