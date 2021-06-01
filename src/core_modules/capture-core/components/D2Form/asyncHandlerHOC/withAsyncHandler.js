// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import { fieldIsValidating, fieldsValidated, startUpdateFieldAsync } from './actions';

type Props = {
    id: string,
    onIsValidating: Function,
    onFieldsValidated: Function,
    onUpdateFieldAsyncInner: Function,
    onUpdateFieldAsync: ?Function,
};

// HOC wrapped around D2Form handling callbacks for async functionality
const getAsyncHandler = (InnerComponent: React.ComponentType<any>) =>
    class AsyncHandlerHOC extends React.Component<Props> {
        // $FlowFixMe[missing-annot] automated comment
        handleIsValidating = (...args) => {
            const { id } = this.props;
            this.props.onIsValidating(...args, id);
        }

        // $FlowFixMe[missing-annot] automated comment
        handleFieldsValidated = (...args) => {
            const { id } = this.props;
            this.props.onFieldsValidated(...args, id);
        }

        // $FlowFixMe[missing-annot] automated comment
        handleUpdateFieldAsyncInner = (...args) => {
            const { onUpdateFieldAsyncInner, onUpdateFieldAsync } = this.props;
            onUpdateFieldAsyncInner(...args, onUpdateFieldAsync);
        };

        render() {
            const {
                onIsValidating,
                onFieldsValidated,
                onUpdateFieldAsyncInner,
                onUpdateFieldAsync,
                ...passOnProps } = this.props;
            return (
                // $FlowFixMe[cannot-spread-inexact] automated comment
                <InnerComponent
                    onIsValidating={this.handleIsValidating}
                    onFieldsValidated={this.handleFieldsValidated}
                    onUpdateFieldAsync={this.handleUpdateFieldAsyncInner}
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
    onUpdateFieldAsyncInner: (
        fieldId: string,
        fieldLabel: string,
        formBuilderId: string,
        formId: string,
        callback: Function,
        onUpdateFieldAsync: ?Function,
    ) => {
        const action = startUpdateFieldAsync(
            fieldId,
            fieldLabel,
            formBuilderId,
            formId,
            uuid(),
            callback,
        );

        if (onUpdateFieldAsync) {
            onUpdateFieldAsync(action);
        } else {
            dispatch(action);
        }
    },
});


export const withAsyncHandler = () =>
    (InnerComponent: React.ComponentType<any>) =>

        // $FlowFixMe[missing-annot] automated comment
        connect(
            mapStateToProps, mapDispatchToProps)((getAsyncHandler(InnerComponent)));
