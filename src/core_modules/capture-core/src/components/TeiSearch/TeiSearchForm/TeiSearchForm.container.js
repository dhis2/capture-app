// @flow
import { connect } from 'react-redux';
import TeiSearchForm from './TeiSearchForm.component';

const mapStateToProps = (state: ReduxState, props: Object) => {
    const searchId = props.searchId;
    const formId = props.id;
    const formState = state.teiSearch[searchId] && state.teiSearch[searchId][formId] ? state.teiSearch[searchId][formId] : {};

    return {
        searchAttempted: formState.validationFailed,
    };
};

// $FlowSuppress
export default connect(mapStateToProps, () => ({}))(TeiSearchForm);
