import { connect } from 'react-redux';
import { TeiSearchFormComponent } from './TeiSearchForm.component';

const getAttributesWithValuesCount = (state, formId) => {
    const formValues = state.formsValues[formId] || {};
    return Object.keys(formValues).filter(key => formValues[key]).length;
};

const mapStateToProps = (state, props) => {
    const searchId = props.searchId;
    const formId = props.id;
    const formState = state.teiSearch[searchId] && state.teiSearch[searchId][formId] ? state.teiSearch[searchId][formId] : {};

    return {
        searchAttempted: formState.validationFailed,
        attributesWithValuesCount: getAttributesWithValuesCount(state, formId),
        formsValues: state.formsValues[formId] || {},
    };
};

export const TeiSearchForm = connect(mapStateToProps, () => ({}))(TeiSearchFormComponent);
