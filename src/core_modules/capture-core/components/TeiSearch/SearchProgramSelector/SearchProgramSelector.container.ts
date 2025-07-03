import { connect } from 'react-redux';
import { SearchProgramSelectorComponent } from './SearchProgramSelector.component';
import { startSetProgram } from './searchProgramSelector.actions';
import { makeProgramOptionsSelector } from './searchProgramSelector.selectors';
import type { ReduxDispatch } from '../../App/withAppUrlSync.types';

type ReduxState = {
    teiSearch: {
        [searchId: string]: {
            selectedProgramId?: string;
        };
    };
};

type Props = {
    searchId: string;
};

const makeMapStateToProps = () => {
    const getProgramOptions = makeProgramOptionsSelector();
    const mapStateToProps = (state: ReduxState, props: Props) => ({
        selectedProgramId: state.teiSearch[props.searchId].selectedProgramId,
        programOptions: getProgramOptions(state, props),
    });
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSetProgram: (searchId: string, programId?: string) => {
        dispatch(startSetProgram(searchId, programId));
    },
});

export const SearchProgramSelector = connect(makeMapStateToProps, mapDispatchToProps)(
    SearchProgramSelectorComponent,
);
