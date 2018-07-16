// @flow
import { connect } from 'react-redux';
import DataEntrySelectionsCompleteHandler from './DataEntryWrapper.component';
import {
    setNewEventFormLayoutDirection,
} from './newEventDataEntry.actions';

const mapStateToProps = (state: ReduxState) => ({
    isSelectionsComplete: !!state.currentSelections.complete,
    formHorizontal: !!state.newEventPage.formHorizontal,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onFormLayoutDirectionChange: (formHorizontal: boolean) => {
        dispatch(setNewEventFormLayoutDirection(formHorizontal));
    },
});
// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(DataEntrySelectionsCompleteHandler);
