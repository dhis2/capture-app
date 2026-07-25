import React, { forwardRef } from 'react';
import i18n from '@dhis2/d2-i18n';
import { connect } from 'react-redux';
import { D2SectionFieldsComponent } from './D2SectionFields.component';
import { updateField } from './D2SectionFields.actions';
import { useProgramLabel } from '../../metaData';
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
    const mapStateToProps = (state: any, props: { formId: string, fieldsMetaData: any }) => ({
        values: getSectionValues(state, props),
        ruleEffects: {
            hiddenFields: getHiddenFields(state, props),
            messages: getRulesMessages(state, props),
            compulsoryFields: getCompulsory(state, props),
            disabledFields: getDisabled(state, props),
        },
        loadNr: state.forms[props.formId].loadNr,
    });
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateField: (value: any, uiState: any, elementId: string, sectionId: string, formId: string) => {
        dispatch(updateField(value, uiState, elementId, sectionId, formId));
    },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const defaultMergedProps = Object.assign({}, ownProps, stateProps, dispatchProps);

    const mergedProps = ownProps.onUpdateField ?
        { ...defaultMergedProps, onUpdateField: ownProps.onUpdateField } :
        defaultMergedProps;
    return mergedProps;
};

const ConnectedD2SectionFields = connect(
    makeMapStateToProps,
    mapDispatchToProps,
    mergeProps,
    { forwardRef: true },
)(D2SectionFieldsComponent);

export const D2SectionFields = forwardRef((props: any, ref) => {
    const orgUnitLabel = useProgramLabel('orgUnit') ?? i18n.t('organisation unit');
    return React.createElement(ConnectedD2SectionFields, { ...props, ref, orgUnitLabel });
});
