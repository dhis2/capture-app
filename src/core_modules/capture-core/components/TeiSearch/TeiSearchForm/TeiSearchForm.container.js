// @flow
import { connect } from 'react-redux';
import TeiSearchForm from './TeiSearchForm.component';

const getAttributesWithValuesCount = (state: ReduxState, formId: string) => {
    const formValues = state.formsValues[formId] || {};
    return Object.keys(formValues).filter(key => formValues[key]).length;
};

const mapStateToProps = (state: ReduxState, props: Object) => {
    const {searchId} = props;
    const formId = props.id;
    const formState = state.teiSearch[searchId] && state.teiSearch[searchId][formId] ? state.teiSearch[searchId][formId] : {};

    return {
        searchAttempted: formState.validationFailed,
        attributesWithValuesCount: getAttributesWithValuesCount(state, formId),
    };
};

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, () => ({}))(TeiSearchForm);
