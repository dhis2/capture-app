// @flow
import { connect } from 'react-redux';
import D2SectionFields from './D2SectionFields.component';
import { updateField } from './D2SectionFields.actions';
import {
    makeGetSectionValues,
    makeGetHiddenFieldsValues,
    makeGetMessages,
    makeGetCompulsory,
    makeGetDisabled,
} from './D2SectionFields.selectors';

const makeMapStateToProps = () => {
    const getSectionValues = makeGetSectionValues();
    const getHiddenFields = makeGetHiddenFieldsValues();
    const getRulesMessages = makeGetMessages();
    const getCompulsory = makeGetCompulsory();
    const getDisabled = makeGetDisabled();
    const mapStateToProps = (state: Object, props: { formId: string }) => ({
        values: getSectionValues(state, props),
        rulesHiddenFields: getHiddenFields(state, props),
        rulesMessages: getRulesMessages(state, props),
        rulesCompulsoryFields: getCompulsory(state, props),
        rulesDisabledFields: getDisabled(state, props),
        loadNr: state.forms[props.formId].loadNr,
    });
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateField: (value: any, uiState: Object, elementId: string, sectionId: string, formId: string) => {
        dispatch(updateField(value, uiState, elementId, sectionId, formId));
    },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const defaultMergedProps = Object.assign({}, ownProps, stateProps, dispatchProps);

    const mergedProps = ownProps.onUpdateField ? { ...defaultMergedProps, onUpdateField: ownProps.onUpdateField } : defaultMergedProps;
    return mergedProps;
};

export default connect(makeMapStateToProps, mapDispatchToProps, mergeProps, { withRef: true })(D2SectionFields);
