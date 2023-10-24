// @flow
import { connect } from 'react-redux';
import { SearchProgramSelectorComponent } from './SearchProgramSelector.component';
import { startSetProgram } from './searchProgramSelector.actions';
import { getProgramOptions } from './getProgramOptions';

const mapStateToProps = (state: ReduxState, props: Object) => ({
    programOptions: getProgramOptions(props.selectedTrackedEntityTypeId),
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetProgram: (searchId: string, programId: ?string) => {
        dispatch(startSetProgram(searchId, programId));
    },
});

// $FlowFixMe[missing-annot] automated comment
export const SearchProgramSelector = connect(mapStateToProps, mapDispatchToProps)(
    SearchProgramSelectorComponent,
);
