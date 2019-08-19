// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { updateField } from '../../actions/dataEntry.actions';
import { getValidationError } from './dataEntryField.utils';
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
    validatorContainers: ?Array<ValidatorContainer>,
    propName: string,
    onUpdateField?: ?(innerAction: ReduxAction<any, any>, data: { value: any }) => void,
    value: any,
    valueMeta: ValueMetaInput,
    itemId: string,
    onUpdateFieldInner: (value: any, valueMeta: ValueMetaUpdateOutput, fieldId: string, dataEntryId: string, itemId: string, onUpdateField: ?Function) => void,
    componentProps: Object,
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

    handleSet = (value: any, options?: ?Options) => {
        const { validatorContainers, onUpdateFieldInner, onUpdateField } = this.props;
        const validationError =
            getValidationError(value, validatorContainers);
        onUpdateFieldInner(value, {
            isValid: !validationError,
            validationError,
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
            onUpdateFieldInner,
            valueMeta,
            itemId,
            dataEntryId,
            componentProps,
            ...passOnProps
        } = this.props;
        const { isValid, type, ...passOnValueMeta } = valueMeta;
        return (
            <div
                ref={(gotoInstance) => { this.gotoInstance = gotoInstance; }}
                key={propName}
            >
                <Component
                    onBlur={this.handleSet}
                    validationAttempted={!!(completionAttempted || saveAttempted)}
                    {...passOnValueMeta}
                    {...passOnProps}
                    {...componentProps}
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

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(DataEntryField);
