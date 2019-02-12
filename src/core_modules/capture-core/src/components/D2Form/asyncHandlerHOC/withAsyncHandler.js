// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { fieldIsValidating, fieldsValidated, cleanUpFormBuilder } from './actions';

type Props = {
    id: string,
    onIsValidating: Function,
    onFieldsValidated: Function,
    onCleanUp: Function,
};

const getAsyncHandler = (InnerComponent: React.ComponentType<any>) =>
    class AsyncHandlerHOC extends React.Component<Props> {
        handleIsValidating = (...args) => {
            const { id } = this.props;
            this.props.onIsValidating(...args, id);
        }

        handleFieldsValidated = (...args) => {
            const { id } = this.props;
            this.props.onFieldsValidated(...args, id);
        }

        handleCleanUp = (...args) => {
            const { id } = this.props;
            this.props.onCleanUp(...args, id);
        }

        render() {
            const { onIsValidating, onFieldsValidated, onCleanUp, ...passOnProps } = this.props;
            return (
                <InnerComponent
                    onIsValidating={this.handleIsValidating}
                    onFieldsValidated={this.handleFieldsValidated}
                    onCleanUp={this.handleCleanUp}
                    {...passOnProps}
                />
            );
        }
    };

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onIsValidating: (
        fieldId: string,
        formBuilderId: string,
        validatingUid: string,
        message: ?string,
        fieldUIUpdates: ?Object,
        formId: string,
    ) => {
        const action = fieldIsValidating(fieldId, formBuilderId, formId, message, fieldUIUpdates, validatingUid);
        dispatch(action);
    },
    onFieldsValidated: (
        fieldsUI: Object,
        formBuilderId: string,
        validatingUids: Array<string>,
        formId: string,
    ) => {
        const action = fieldsValidated(fieldsUI, formBuilderId, formId, validatingUids);
        dispatch(action);
    },
    onCleanUp: (
        remainingUids: Array<string>,
        formId: string,
    ) => {
        dispatch(cleanUpFormBuilder(remainingUids, formId));
    },
});


export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(
            mapStateToProps, mapDispatchToProps)((getAsyncHandler(InnerComponent)));
