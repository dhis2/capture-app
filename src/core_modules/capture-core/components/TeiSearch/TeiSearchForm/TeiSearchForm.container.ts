import { connect } from 'react-redux';
import { TeiSearchFormComponent } from './TeiSearchForm.component';

type ReduxState = {
    teiSearch: {
        [searchId: string]: {
            validationFailed?: boolean;
        };
    };
    formsValues: {
        [formId: string]: Record<string, any>;
    };
};

type Props = {
    searchId: string;
    id: string;
};

const getAttributesWithValuesCount = (state: ReduxState, formId: string) => {
    const formValues = state.formsValues[formId] || {};
    return Object.keys(formValues).filter(key => formValues[key]).length;
};

const mapStateToProps = (state: ReduxState, props: Props) => {
    const searchId = props.searchId;
    const formId = props.id;
    const formState = state.teiSearch[searchId]?.[formId] ?? {};

    return {
        searchAttempted: formState.validationFailed,
        attributesWithValuesCount: getAttributesWithValuesCount(state, formId),
        formsValues: state.formsValues[formId] || {},
    };
};

export const TeiSearchForm = connect(mapStateToProps, () => ({}))(TeiSearchFormComponent);
