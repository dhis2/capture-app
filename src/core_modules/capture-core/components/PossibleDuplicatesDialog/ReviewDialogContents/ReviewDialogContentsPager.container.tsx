import { connect } from 'react-redux';
import type { ReduxStore } from '../../../../../core_modules/capture-core-utils/types/global';
import { ReviewDialogContentsPagerComponent } from './ReviewDialogContentsPager.component';

type StateProps = {
    currentPage: number;
};

type DispatchProps = {
};

type PossibleDuplicatesState = ReduxStore['value']['possibleDuplicates'];

type State = {
    possibleDuplicates: PossibleDuplicatesState;
};

const mapStateToProps = (
    state: State,
): StateProps => ({
    currentPage: state.possibleDuplicates.currentPage || 1,
});

const mapDispatchToProps = (): DispatchProps => ({});

export const ReviewDialogContentsPager = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ReviewDialogContentsPagerComponent);
