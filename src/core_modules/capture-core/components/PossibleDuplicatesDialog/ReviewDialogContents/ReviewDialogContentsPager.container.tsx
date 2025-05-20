import { connect } from 'react-redux';
import type { ReduxStore } from '../../../../../core_modules/capture-core-utils/types/global';
import { ReviewDialogContentsPagerComponent } from './ReviewDialogContentsPager.component';

const mapStateToProps = (
    { possibleDuplicates }: ReduxStore['value'],
) => ({
    currentPage: possibleDuplicates.currentPage || 1,
});

const mapDispatchToProps = () => ({});

export const ReviewDialogContentsPager = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ReviewDialogContentsPagerComponent);
