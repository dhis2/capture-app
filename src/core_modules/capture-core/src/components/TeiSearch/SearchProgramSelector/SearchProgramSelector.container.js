// @flow
import { connect } from 'react-redux';
import SearchProgramSelector from './SearchProgramSelector.component';
import { startSetProgram } from './searchProgramSelector.actions';


const mapStateToProps = (state: ReduxState, props: Object) => {
    return {
        selectedProgramId: state.teiSearch[props.searchId].selectedProgramId,
    };
};

// $FlowFixMe
const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetProgram: (searchId: string, programId: ?string) => {
        dispatch(startSetProgram(searchId, programId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchProgramSelector);
