import { connect } from 'react-redux';
import { TeiSearchFormComponent } from './TeiSearchForm.component';

type ReduxState = {
    formsValues: {
        [key: string]: Record<string, any>;
    };
    teiSearch: {
        [key: string]: {
            [key: string]: {
                validationFailed?: boolean;
            };
        };
    };
};

type OwnProps = {
    searchId: string;
    id: string;
    searchGroupId: string;
    searchGroup: any;
    onSearch: (formId: string, searchGroupId: string) => void;
    onSearchValidationFailed: (formId: string, searchGroupId: string) => void;
};

const getAttributesWithValuesCount = (state: ReduxState, formId: string) => {
    const formValues = state.formsValues[formId] || {};
    return Object.keys(formValues).filter(key => formValues[key]).length;
};

const mapStateToProps = (state: ReduxState, props: OwnProps) => {
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
