// @flow
import { connect } from 'react-redux';
import FormBuilder from 'capture-ui/FormBuilder/FormBuilder.component';
import { updateFieldUIOnly } from './formBuilder.actions';

const mapStateToProps = (state: ReduxState, props: { id: string }) => ({
    fieldsUI: state.formsSectionsFieldsUI[props.id] || {},
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
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
        ref: formBuilderRef,
    };
};

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(FormBuilder);
