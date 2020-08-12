// @flow
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import ReviewDialogContents from './ReviewDialogContents.component';
import withLoadingIndicator from '../../../../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../../../../HOC/withErrorMessageHandler';
import { makeDataElementsSelector } from './reviewDialogContents.selectors';

const makeMapStateToProps = () => {
    const dataElementsSelector = makeDataElementsSelector();
    const mapStateToProps = (state: ReduxState, props: Object) => ({
        ready: !state.newRelationshipRegisterTeiDuplicatesReview.isLoading,
        isUpdating: state.newRelationshipRegisterTeiDuplicatesReview.isUpdating,
        error: state.newRelationshipRegisterTeiDuplicatesReview.loadError ?
            i18n.t('An error occured loading possible duplicates') : null,
        teis: state.newRelationshipRegisterTeiDuplicatesReview.teis,
        dataElements: dataElementsSelector(state, props),
    });
    // $FlowFixMe
    return mapStateToProps;
};

const mapDispatchToProps = () => ({
});

// $FlowFixMe
export default connect(makeMapStateToProps, mapDispatchToProps)(
    withLoadingIndicator(() => ({ padding: 5, width: 640, height: 500 }))(
        withErrorMessageHandler()(
            ReviewDialogContents,
        ),
    ),
);
