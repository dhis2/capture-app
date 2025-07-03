import { connect } from 'react-redux';
import { SearchProgramSelectorComponent } from './SearchProgramSelector.component';
import { startSetProgram } from './searchProgramSelector.actions';
import { getProgramOptions } from './getProgramOptions';

const mapStateToProps = (state, props) => ({
    programOptions: getProgramOptions(props.selectedTrackedEntityTypeId),
});

const mapDispatchToProps = (dispatch) => ({
    onSetProgram: (searchId, programId) => {
        dispatch(startSetProgram(searchId, programId));
    },
});

export const SearchProgramSelector = connect(mapStateToProps, mapDispatchToProps)(
    SearchProgramSelectorComponent,
);
