// @flow
import { connect } from 'react-redux';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import SelectorLevel from '../SelectorLevel/SelectorLevel.container';

const mapStateToProps = (state: ReduxState) => ({
    error: state.newEventPage.selectionsError,
    ready: !state.newEventPage.isLoading,
});


export default connect(mapStateToProps, () => ({}))(
    withLoadingIndicator()(
        withErrorMessageHandler()(SelectorLevel),
    ),
);

