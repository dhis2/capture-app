import * as React from 'react';
import { connect } from 'react-redux';
import { updateField } from '../../actions/dataEntry.actions';
import { getValidationError } from './dataEntryField.utils';
import { getDataEntryKey } from '../../common/getDataEntryKey';
import type { Props, Options, ContainerProps, ValueMetaUpdateOutput, ValueMetaInput } from './DataEntryField.types';

class DataEntryFieldPlain extends React.Component<Props> {
    gotoInstance?: HTMLDivElement;
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
                window.scroll(0, scrolledY - 48);
            }
        }
    }

    handleSet = (value: any, options?: Options) => {
        const { validatorContainers, onUpdateFieldInner, onUpdateField } = this.props;
        const validationError =
            getValidationError(value, validatorContainers, { error: options?.error, errorCode: options?.errorCode });
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
            valueMeta = {},
            itemId,
            dataEntryId,
            componentProps,
            ...passOnProps
        } = this.props;
        const { isValid, type, ...passOnValueMeta } = valueMeta as ValueMetaInput;
        return (
            <div
                ref={(gotoInstance) => { this.gotoInstance = gotoInstance || undefined; }}
                key={propName}
                data-test={`dataentry-field-${propName}`}
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

const mapStateToProps = (state: any, props: ContainerProps) => {
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

const mapDispatchToProps = (dispatch: any) => ({
    onUpdateFieldInner: (
        value: any,
        valueMeta: ValueMetaUpdateOutput,
        fieldId: string,
        dataEntryId: string,
        itemId: string,
        onUpdateField?: (innerAction: any, data: { value: any; valueMeta: ValueMetaUpdateOutput; fieldId: string; dataEntryId: string; itemId: string }) => void,
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

export const DataEntryField = connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { forwardRef: true },
)(DataEntryFieldPlain);
