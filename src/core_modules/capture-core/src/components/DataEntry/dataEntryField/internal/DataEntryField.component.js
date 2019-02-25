// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { updateField } from '../../actions/dataEntry.actions';
import { getValidationErrors } from './dataEntryField.utils';
import getDataEntryKey from '../../common/getDataEntryKey';
import type { ValidatorContainer } from './dataEntryField.utils';

type ValueMetaInput = {
    validationError: ?string,
    isValid: boolean,
    touched: boolean,
    type: string,
};

type ValueMetaUpdateOutput = {
    validationError: ?string,
    isValid: boolean,
    touched: boolean,
};

type Props = {
    dataEntryId: string,
    completionAttempted?: ?boolean,
    saveAttempted?: ?boolean,
    Component: React.ComponentType<any>,
    validatorContainers: Array<ValidatorContainer>,
    propName: string,
    onUpdateField?: ?(innerAction: ReduxAction<any, any>, data: { value: any }) => void,
    value: any,
    valueMeta: ValueMetaInput,
    itemId: string,
    onUpdateFieldInner: (value: any, valueMeta: ValueMetaUpdateOutput, fieldId: string, dataEntryId: string, itemId: string, onUpdateField: ?Function) => void,
};

type Options = {
    touched?: ?boolean,
};

type ContainerProps = {
    dataEntryId: string,
    completionAttempted?: ?boolean,
    saveAttempted?: ?boolean,
    propName: string,
};

class DataEntryField extends React.Component<Props> {
    gotoInstance: ?HTMLDivElement;
    validateAndScrollToIfFailed() {
        const isValid = this.props.valueMeta && this.props.valueMeta.isValid;

        if (!isValid) {
            this.goto();
        }

        return isValid;
    }

    goto() {
        if (this.gotoInstance) {
            this.gotoInstance.scrollIntoView();

            const scrolledY = window.scrollY;
            if (scrolledY) {
                // TODO: Set the modifier some other way (caused be the fixed header)
                window.scroll(0, scrolledY - 48);
            }
        }
    }

    handleBlur = (value: any, options?: ?Options) => {
        const { validatorContainers, onUpdateFieldInner, onUpdateField } = this.props;
        const validationErrors =
            getValidationErrors(value, validatorContainers);
        onUpdateFieldInner(value, {
            isValid: validationErrors.length === 0,
            validationError: validationErrors.length > 0 ? validationErrors[0] : null,
            touched: options && options.touched != null ? options.touched : true,
        }, this.props.propName, this.props.dataEntryId, this.props.itemId, onUpdateField);
    }

    render() {
        const {
            completionAttempted,
            saveAttempted,
            Component,
            validatorContainers,
            propName,
            onUpdateField,
            valueMeta,
            itemId,
            ...passOnProps
        } = this.props;
        const { isValid, type, ...passOnValueMeta } = valueMeta;
        return (
            <div
                ref={(gotoInstance) => { this.gotoInstance = gotoInstance; }}
                key={propName}
            >
                <Component
                    onBlur={this.handleBlur}
                    validationAttempted={!!(completionAttempted || saveAttempted)}
                    {...passOnValueMeta}
                    {...passOnProps}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: ReduxState, props: ContainerProps) => {
    const propName = props.propName;
    const itemId = state.dataEntries[props.dataEntryId].itemId;
    const key = getDataEntryKey(props.dataEntryId, itemId);

    return {
        value: state.dataEntriesFieldsValue[key][propName],
        valueMeta: state.dataEntriesFieldsUI[key][propName],
        itemId,
        propName,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateFieldInner: (
        value: any,
        valueMeta: ValueMetaUpdateOutput,
        fieldId: string,
        dataEntryId: string,
        itemId: string,
        onUpdateField: ?Function,
    ) => {
        const action = updateField(value, valueMeta, fieldId, dataEntryId, itemId);
        if (onUpdateField) {
            onUpdateField(action, {
                value,
                valueMeta,
                fieldId,
                dataEntryId,
                itemId,
            });
        } else {
            dispatch(updateField(value, valueMeta, fieldId, dataEntryId, itemId));
        }
    },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { innerFieldRef, ...editedOwnProps } = ownProps;
    const mergedProps = Object.assign({
        ref: innerFieldRef,
    }, editedOwnProps, stateProps, dispatchProps);
    return mergedProps;
};
// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DataEntryField);
