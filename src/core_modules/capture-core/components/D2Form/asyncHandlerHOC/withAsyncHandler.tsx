import * as React from 'react';
import { connect } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { fieldIsValidating, fieldsValidated, startUpdateFieldAsync } from './actions';

type Props = {
    id: string;
    onIsValidating: (...args: any[]) => any;
    onFieldsValidated: (...args: any[]) => any;
    onUpdateFieldAsyncInner: (...args: any[]) => any;
    onUpdateFieldAsync?: ((...args: any[]) => any) | null;
};

const getAsyncHandler = (InnerComponent: React.ComponentType<any>) =>
    class AsyncHandlerHOC extends React.Component<Props> {
        handleIsValidating = (...args: any[]) => {
            const { id } = this.props;
            this.props.onIsValidating(...args, id);
        }

        handleFieldsValidated = (...args: any[]) => {
            const { id } = this.props;
            this.props.onFieldsValidated(...args, id);
        }

        handleUpdateFieldAsyncInner = (...args: any[]) => {
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

const mapDispatchToProps = (dispatch: any) => ({
    onIsValidating: (
        fieldId: string,
        formBuilderId: string,
        validatingUid: string,
        message: string | null,
        fieldUIUpdates: any | null,
        formId: string,
    ) => {
        const action = fieldIsValidating(fieldId, formBuilderId, formId, message, fieldUIUpdates, validatingUid);
        dispatch(action);
    },
    onFieldsValidated: (
        fieldsUI: any,
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
        callback: (...args: any[]) => any,
        onUpdateFieldAsync?: ((...args: any[]) => any) | null,
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
        connect(
            mapStateToProps, mapDispatchToProps)((getAsyncHandler(InnerComponent)));
