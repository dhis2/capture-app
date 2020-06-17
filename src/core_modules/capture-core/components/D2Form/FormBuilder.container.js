// @flow
import React from 'react';
import { connect } from 'react-redux';
import FormBuilder from '../FormBuilder/FormBuilder.component';
import { updateFieldUIOnly } from './formBuilder.actions';

const FormBuilderRefBuilder = (props: Object) => {
    const { formBuilderRef, ...passOnProps } = props;
    return (
        <FormBuilder
            ref={formBuilderRef}
            {...passOnProps}
        />
    );
};

const mapStateToProps = (state: ReduxState, props: { id: string }) => ({
    fieldsUI: state.formsSectionsFieldsUI[props.id] || {},
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateFieldUIOnly: (uiState: Object, fieldId: string, formBuilderId: string) => {
        dispatch(updateFieldUIOnly(uiState, fieldId, formBuilderId));
    },
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(FormBuilderRefBuilder);
