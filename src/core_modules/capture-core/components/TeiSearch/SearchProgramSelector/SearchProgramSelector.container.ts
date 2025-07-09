import { connect } from 'react-redux';
import { SearchProgramSelectorComponent } from './SearchProgramSelector.component';
import { startSetProgram } from './searchProgramSelector.actions';
import { makeProgramOptionsSelector } from './searchProgramSelector.selectors';

const makeMapStateToProps = () => {
    const getProgramOptions = makeProgramOptionsSelector();
    const mapStateToProps = (state: any, props: any) => ({
        selectedProgramId: state.teiSearch[props.searchId].selectedProgramId,
        programOptions: getProgramOptions(state, props),
    });
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: any) => ({
    onSetProgram: (searchId: string, programId?: string) => {
        dispatch(startSetProgram(searchId, programId));
    },
});

export const SearchProgramSelector = connect(makeMapStateToProps, mapDispatchToProps)(
    SearchProgramSelectorComponent,
);
