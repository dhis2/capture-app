// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';

import withFocusSaver from '../HOC/withFocusSaver';
import withShrinkLabel from '../HOC/withShrinkLabel';
import withFocusHandler from '../internal/TextInput/withFocusHandler';
import TextInput from '../internal/TextInput/TextInput.component';
import defaultClasses from './numberRangeField.mod.css';

const RangeInputField = withFocusSaver()(withShrinkLabel()(withFocusHandler()(TextInput)));
type Props = {
    value?: ?Object,
    onChange?: (value: any) => void,
    onBlur?: (value: any) => void,
}

const messageTypeClass = {
    error: 'innerInputError',
    info: 'innerInputInfo',
    warning: 'innerInputWarning',
    validating: 'innerInputValidating',
};

class NumberRangeField extends React.Component<Props> {

    getNewValue = (newValues) => {
        const value = { ...this.props.value, ...newValues };
        if (!value.from && !value.to) {
            return null;
        }
        return value;
    }

    onChange = (inputValueObject: Object) => {
        this.props.onChange && this.props.onChange(this.getNewValue(inputValueObject));
    }

    onBlur = (inputValueObject: Object) => {
        this.props.onBlur && this.props.onBlur(this.getNewValue(inputValueObject));
    }

    renderMessage = (key: string) => {
        const { classes, innerMessage: messageContainer } = this.props;
        if (messageContainer) {
            const message = messageContainer.message && messageContainer.message[key];
            const className = (classes && classes[messageTypeClass[messageContainer.messageType]]) || '';
            return message && (<div className={className}>{message}</div>);
        }
        return null;
    }

    render() {
        const { value, onChange, onBlur, innerMessage, ...passOnProps } = this.props;
        const fromValue = value && value.from ? value.from : '';
        const toValue = value && value.to ? value.to : '';
        return (
            <div className={defaultClasses.container}>
                <div className={defaultClasses.inputContainer}>
                    <RangeInputField
                        label={i18n.t('From')}
                        onChange={(e) => { this.onChange({ from: e.currentTarget.value }); }}
                        onBlur={(e) => { this.onBlur({ from: e.currentTarget.value }); }}
                        value={fromValue}
                        {...passOnProps}
                    />
                    {innerMessage && this.renderMessage('from')}
                </div>
                <div className={defaultClasses.inputContainer}>
                    <RangeInputField
                        label={i18n.t('To')}
                        onChange={(e) => { this.onChange({ to: e.currentTarget.value }); }}
                        onBlur={(e) => { this.onBlur({ to: e.currentTarget.value }); }}
                        value={toValue}
                        {...passOnProps}
                    />
                    {innerMessage && this.renderMessage('to')}
                </div>
            </div>


        );
    }
}
export default NumberRangeField;
