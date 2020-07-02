// @flow
import { connect } from 'react-redux';
import SearchProgramSelector from './SearchProgramSelector.component';
import { startSetProgram } from './searchProgramSelector.actions';
import { makeProgramOptionsSelector } from './searchProgramSelector.selectors';

const makeMapStateToProps = () => {
    const getProgramOptions = makeProgramOptionsSelector();
    const mapStateToProps = (state: ReduxState, props: Object) => ({
        selectedProgramId: state.teiSearch[props.searchId].selectedProgramId,
        programOptions: getProgramOptions(state, props),
    });
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetProgram: (searchId: string, programId: ?string) => {
        dispatch(startSetProgram(searchId, programId));
    },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(SearchProgramSelector);
