// @flow
import { connect } from 'react-redux';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import NewEventSelector from '../NewEventSelector/NewEventSelector.container';

const mapStateToProps = (state: ReduxState) => ({
    error: state.newEventPage.selectionsError,
});


export default connect(mapStateToProps, () => ({}))(withErrorMessageHandler()(NewEventSelector));

