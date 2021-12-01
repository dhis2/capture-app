// @flow
import { connect } from 'react-redux';
import {
    cancelNewEventAndReturnToMainPage,
} from '../DataEntryWrapper/DataEntry/actions/dataEntry.actions';
import { DataEntrySelectionsNoAccess } from './dataEntrySelectionsNoAccess.component';

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
