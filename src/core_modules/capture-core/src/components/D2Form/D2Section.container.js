// @flow
import { connect } from 'react-redux';
import D2Section from './D2Section.component';
import { updateSectionStatus } from './D2Section.actions';

const mapStateToProps = (state: Object) => ({

});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateSectionStatus: (id: string, status: Object) => {
        dispatch(updateSectionStatus(id, status));
    },
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(D2Section);
