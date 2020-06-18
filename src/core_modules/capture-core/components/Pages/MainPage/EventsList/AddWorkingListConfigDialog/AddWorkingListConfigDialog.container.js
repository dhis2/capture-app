// @flow
import { connect } from 'react-redux';
import AddWorkingListConfigDialog from './AddWorkingListConfigDialog.component';
import { addWorkingListConfig } from '../eventsList.actions';

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onAddWorkingListConfig: (name: string, description: string) => {
        // todo addWorkingListConfig is not a function (report lgtm).
        dispatch(addWorkingListConfig(name, description));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddWorkingListConfigDialog);
