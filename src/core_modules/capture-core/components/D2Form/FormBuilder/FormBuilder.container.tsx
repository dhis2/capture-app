import React from 'react';
import { connect } from 'react-redux';
import { FormBuilder } from './index';
import { updateFieldUIOnly } from './formBuilder.actions';

const FormBuilderRefBuilder = (props: any) => {
    const { formBuilderRef, ...passOnProps } = props;
    return (
        <FormBuilder
            ref={formBuilderRef}
            {...passOnProps}
        />
    );
};

const mapStateToProps = (state: any, props: { id: string }) => ({
    fieldsUI: state.formsSectionsFieldsUI[props.id] || {},
});

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateFieldUIOnly: (uiState: any, fieldId: string, formBuilderId: string) => {
        dispatch(updateFieldUIOnly(uiState, fieldId, formBuilderId));
    },
});

export const FormBuilderContainer = connect(mapStateToProps, mapDispatchToProps)(FormBuilderRefBuilder);
