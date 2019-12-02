// @flow
import { connect } from 'react-redux';
import SaveConfigDialog from './SaveConfigDialog.component';
import { requestConfigSave } from './saveConfigDialog.actions';

const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSaveConfig: dispatch(requestConfigSave()),
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(SaveConfigDialog);
