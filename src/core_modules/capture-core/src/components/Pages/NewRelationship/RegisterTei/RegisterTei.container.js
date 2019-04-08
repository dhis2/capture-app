// @flow
import { connect } from 'react-redux';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import RegisterTei from './RegisterTei.component';

const mapStateToProps = (state: ReduxState) => ({
    ready: !state.newRelationshipRegisterTei.loading,
    error: state.newRelationshipRegisterTei.error,
});

const mapDispatchToProps = () => ({
    onLink: () => {
        debugger;
    },
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(
        withErrorMessageHandler()(
            RegisterTei,
        ),
    ),
);
