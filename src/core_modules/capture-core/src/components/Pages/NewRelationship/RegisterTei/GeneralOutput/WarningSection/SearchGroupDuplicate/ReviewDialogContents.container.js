// @flow
import { connect } from 'react-redux';
import ReviewDialogContents from './ReviewDialogContents.component';
import withLoadingIndicator from '../../../../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../../../../HOC/withErrorMessageHandler';
import i18n from '@dhis2/d2-i18n';

const makeMapStateToProps = () => {
    const dataElementsSelector = makeDataElementsSelector();
    const mapStateToProps = (state: ReduxState, props: Object) => ({
        ready: !state.newRelationshipRegisterTei.duplicatesReviewIsLoading,
        error: state.newRelationshipRegisterTei.duplicatesReviewLoadError ?
            i18n.t('An error occured loading possible duplicates') : null,
        teis: state.newRelationshipRegisterTei.duplicates,    
    });
    return mapStateToProps;
}

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
});

// $FlowSuppress
export default connect(makeMapStateToProps, mapDispatchToProps)(
    withLoadingIndicator(() => ({ padding: 5 }))(
        withErrorMessageHandler()(
            ReviewDialogContents,
        ),
    ),
);
