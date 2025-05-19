import { connect } from 'react-redux';
import { ReviewDialogContentsPagerComponent } from './ReviewDialogContentsPager.component';

const mapStateToProps = (
    { possibleDuplicates }: { possibleDuplicates: { currentPage: number } },
) => ({
    currentPage: possibleDuplicates.currentPage || 1,
});

const mapDispatchToProps = () => ({});

export const ReviewDialogContentsPager = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ReviewDialogContentsPagerComponent);
