// @flow
import { batchActions } from 'redux-batched-actions';
import { replace } from 'react-router-redux';
import { connect } from 'react-redux';
import TempSelector from './TempSelector.component';
import { openNewEventPage } from './tempSelector.actions';

const mapStateToProps = (state: ReduxState) => ({
    programId: state.currentSelections.programId,
    orgUnitId: state.currentSelections.orgUnitId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onOpenNewEventPage: (programId: string, orgUnitId: string) => {
        dispatch(openNewEventPage());
        dispatch(replace(`/newEvent/programId=${programId}&orgUnitId=${orgUnitId}`));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(TempSelector);
