// @flow
import { connect } from 'react-redux';
import FormBuilder from 'capture-ui/FormBuilder/FormBuilder.component';
import { fieldsValidated, updateFieldUIOnly, fieldIsValidating } from './formBuilder.actions';

const mapStateToProps = (state: ReduxState, props: { id: string }) => ({
    fieldsUI: state.formsSectionsFieldsUI[props.id] || {},
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onFieldsValidatedInner: (
        fieldsUI: Object,
        id: string,
        promisesForIsValidating: Array<Promise<any>>,
        onFieldsValidated: ?(formBuilderId: string, promisesForIsValidating: Array<Promise<any>>, innerAction: ReduxAction<any, any>) => void,
    ) => {
        const innerAction = fieldsValidated(fieldsUI, id);
        if (onFieldsValidated) {
            onFieldsValidated(id, promisesForIsValidating, innerAction);
        } else {
            dispatch(innerAction);
        }
    },
    onUpdateFieldUIOnly: (uiState: Object, fieldId: string, formBuilderId: string) => {
        dispatch(updateFieldUIOnly(uiState, fieldId, formBuilderId));
    },
    onIsValidatingInner: (
        fieldId: string,
        formBuilderId: string,
        onGetValidationPromise: Function,
        onIsValidating: ?(fieldId: string, formBuilderId: string, validationPromise: Function, innerAction: ReduxAction<any, any>) => void,
    ) => {
        const innerAction = fieldIsValidating(fieldId, formBuilderId);
        if (onIsValidating) {
            onIsValidating(fieldId, formBuilderId, onGetValidationPromise, innerAction);
        } else {
            dispatch(innerAction);
        }
    },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { formBuilderRef, ...passOnOwnProps } = ownProps;
    return {
        ...passOnOwnProps,
        ...stateProps,
        ...dispatchProps,
        ref: formBuilderRef,
    };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(FormBuilder);
