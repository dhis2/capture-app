// @flow
import { connect } from 'react-redux';
import FormBuilder from '../../__TEMP__/FormBuilderExternalState.component';
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

export default connect(mapStateToProps, mapDispatchToProps)(FormBuilder);
