// @flow
import { connect } from 'react-redux';
import TempSelector from './TempSelector.component';
import { openNewEventPage } from './tempSelector.actions';

const mapStateToProps = (state: ReduxState) => ({
    programId: state.currentSelections.programId,
    orgUnitId: state.currentSelections.orgUnitId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onOpenNewEventPage: (programId: string, orgUnitId: string) => {
        dispatch(openNewEventPage(programId, orgUnitId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(TempSelector);
