// @flow
import { connect } from 'react-redux';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import SelectorLevel from '../SelectorLevel/SelectorLevel.container';

const mapStateToProps = (state: ReduxState) => ({
    error: state.newEventPage.selectionsError,
});


export default connect(mapStateToProps, () => ({}))(withErrorMessageHandler()(SelectorLevel));

