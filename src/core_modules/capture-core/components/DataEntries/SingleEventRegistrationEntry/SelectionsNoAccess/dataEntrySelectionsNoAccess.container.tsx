import { connect } from 'react-redux';
import { DataEntrySelectionsNoAccess } from './dataEntrySelectionsNoAccess.component';
import {
    cancelNewEventAndReturnToMainPage,
} from '../DataEntryWrapper/DataEntry/actions/dataEntry.actions';

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch: any) => ({
    onCancel: () => {
        dispatch(cancelNewEventAndReturnToMainPage());
    },
});

export const SelectionsNoAccess = connect(mapStateToProps, mapDispatchToProps)(DataEntrySelectionsNoAccess);
