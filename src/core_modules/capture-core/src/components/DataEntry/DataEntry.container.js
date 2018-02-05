// @flow
import { connect } from 'react-redux';
import { ensureState } from 'redux-optimistic-ui';
import DataEntry from './DataEntry.component';

const mapStateToProps = (state: Object, props: { id: string }) => ({
    event: state.dataEntries[props.id] && state.dataEntries[props.id].eventId && ensureState(state.events)[state.dataEntries[props.id].eventId],
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
  
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DataEntry);
