// @flow
import { connect } from 'react-redux';
import FormBuilder from 'capture-ui/FormBuilder/FormBuilder.component';
import { fieldsValidated, updateFieldUIOnly } from './formBuilder.actions';

const mapStateToProps = (state: ReduxState, props: { id: string }) => ({
    fieldsUI: state.formsSectionsFieldsUI[props.id] || {},
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onFieldsValidated: (fieldsUI: Object, id: string) => {
        dispatch(fieldsValidated(fieldsUI, id));
    },
    onUpdateFieldUIOnly: (uiState: Object, fieldId: string, formBuilderId: string) => {
        dispatch(updateFieldUIOnly(uiState, fieldId, formBuilderId));
    },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { formBuilderRef, ...passOnOwnProps } = ownProps;
    return {
        ...passOnOwnProps,
        ...stateProps,
        ...dispatchProps,
        innerRef: formBuilderRef,
    };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(FormBuilder);
