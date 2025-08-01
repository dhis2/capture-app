import { connect } from 'react-redux';
import { SearchProgramSelectorComponent } from './SearchProgramSelector.component';
import { startSetProgram } from './searchProgramSelector.actions';
import { getProgramOptions } from './getProgramOptions';
import type { ReduxState, ReduxDispatch } from '../../../../../App/withAppUrlSync.types';

const mapStateToProps = (state: ReduxState, props: { selectedTrackedEntityTypeId: string }) => ({
    programOptions: getProgramOptions(props.selectedTrackedEntityTypeId),
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetProgram: (searchId: string, programId?: string) => {
        dispatch(startSetProgram(searchId, programId));
    },
});

export const SearchProgramSelector = connect(mapStateToProps, mapDispatchToProps)(
    SearchProgramSelectorComponent,
);
