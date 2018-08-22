// @flow
import { connect } from 'react-redux';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import EditEventSelector from '../EditEventSelector/EditEventSelector.container';

const mapStateToProps = (state: ReduxState) => ({
    error: state.editEventPage.loadError,
});


export default connect(mapStateToProps, () => ({}))(withErrorMessageHandler()(EditEventSelector));

