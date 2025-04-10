import { connect } from 'react-redux';
import { SearchProgramSelectorComponent } from './SearchProgramSelector.component';
import { startSetProgram } from './searchProgramSelector.actions';
import { getProgramOptions } from './getProgramOptions';

type ReduxState = Record<string, any>;
type OwnProps = {
    searchId: string;
    selectedProgramId: string | null;
    selectedTrackedEntityTypeId: string;
};

const mapStateToProps = (state: ReduxState, props: OwnProps) => ({
    programOptions: getProgramOptions(props.selectedTrackedEntityTypeId),
});

type ReduxDispatch = (action: any) => void;

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetProgram: (searchId: string, programId: string | null) => {
        dispatch(startSetProgram(searchId, programId));
    },
});

export const SearchProgramSelector = connect(mapStateToProps, mapDispatchToProps)(
    SearchProgramSelectorComponent,
);
