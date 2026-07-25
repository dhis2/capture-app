import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { connect } from 'react-redux';
import { FormBuilder } from './index';
import { updateFieldUIOnly } from './formBuilder.actions';
import { useProgramLabel } from '../../../metaData';

const FormBuilderRefBuilder = (props: any) => {
    const { formBuilderRef, ...passOnProps } = props;
    const orgUnitLabel = useProgramLabel('orgUnit') ?? i18n.t('organisation unit');
    return (
        <FormBuilder
            ref={formBuilderRef}
            orgUnitLabel={orgUnitLabel}
            {...passOnProps}
        />
    );
};

const mapStateToProps = (state: any, props: { id: string }) => ({
    values: state.formsValues[props.id] || {},
    fieldsUI: state.formsSectionsFieldsUI[props.id] || {},
});

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateFieldUIOnly: (uiState: any, fieldId: string, formBuilderId: string) => {
        dispatch(updateFieldUIOnly(uiState, fieldId, formBuilderId));
    },
});

export const FormBuilderContainer = connect(mapStateToProps, mapDispatchToProps)(FormBuilderRefBuilder);
