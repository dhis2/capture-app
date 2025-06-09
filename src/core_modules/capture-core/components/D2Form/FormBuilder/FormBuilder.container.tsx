import React from 'react';
import { connect } from 'react-redux';
import { FormBuilder } from './index';
import { updateFieldUIOnly } from './formBuilder.actions';

type FormBuilderRefBuilderProps = {
    formBuilderRef?: React.Ref<any>;
    [key: string]: any;
};

const FormBuilderRefBuilder = (props: FormBuilderRefBuilderProps) => {
    const { formBuilderRef, ...passOnProps } = props;
    return (
        <FormBuilder
            ref={formBuilderRef}
            {...passOnProps as any}
        />
    );
};

type StateProps = {
    fieldsUI: Record<string, any>;
};

type DispatchProps = {
    onUpdateFieldUIOnly: (uiState: Record<string, unknown>, fieldId: string, formBuilderId: string) => void;
};

type OwnProps = {
    id: string;
    [key: string]: any;
};

const mapStateToProps = (state: any, props: OwnProps): StateProps => ({
    fieldsUI: state.formsSectionsFieldsUI[props.id] || {},
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
    onUpdateFieldUIOnly: (uiState: Record<string, unknown>, fieldId: string, formBuilderId: string) => {
        dispatch(updateFieldUIOnly(uiState, fieldId, formBuilderId));
    },
});

export const FormBuilderContainer = connect(mapStateToProps, mapDispatchToProps)(FormBuilderRefBuilder);
