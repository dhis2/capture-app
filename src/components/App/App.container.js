// @flow
import {connect} from 'react-redux';
import App from './App.component';

const mapStateToProps =
    (state: TrackerStateContainer) =>
        ({
            ready: state.app.ready,
        });

const mapDispatchToProps =
    (dispatch: TrackerDispatch) =>
        ({

        });

export default connect(mapStateToProps, mapDispatchToProps)(App);
