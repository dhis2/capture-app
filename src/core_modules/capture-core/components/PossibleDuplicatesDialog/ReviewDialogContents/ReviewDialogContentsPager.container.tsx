import { connect } from 'react-redux';
import { ReviewDialogContentsPagerComponent } from './ReviewDialogContentsPager.component';

type StateProps = {
    currentPage: number;
};

type DispatchProps = {
};

type State = {
    possibleDuplicates: {
        currentPage?: number;
    };
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
