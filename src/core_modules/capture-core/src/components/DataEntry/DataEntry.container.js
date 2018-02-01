// @flow
import { connect } from 'react-redux';
import { ensureState } from 'redux-optimistic-ui';
import DataEntry from './DataEntry.component';

const mapStateToProps = (state: Object, props: { id: string }) => ({
    event: state.dataEntry[props.id] && state.dataEntry[props.id].eventId && ensureState(state.events)[state.dataEntry[props.id].eventId],
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
  
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DataEntry);
