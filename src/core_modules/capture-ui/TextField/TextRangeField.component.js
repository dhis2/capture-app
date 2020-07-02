// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';

import withFocusSaver from '../HOC/withFocusSaver';
import withShrinkLabel from '../HOC/withShrinkLabel';
import withFocusHandler from '../internal/TextInput/withFocusHandler';
import TextInput from '../internal/TextInput/TextInput.component';
import defaultClasses from './textRangeField.module.css';
import InnerMessage from '../internal/InnerMessage/InnerMessage.component';

const RangeInputField = withFocusSaver()(withShrinkLabel()(withFocusHandler()(TextInput)));

const inputKeys = {
    FROM: 'from',
    TO: 'to',
};

type TextRangeValue = {
    from?: ?string,
    to?: ?string,
}

type Props = {
    classes?: ?Object,
    innerMessage?: ?Object,
    value: TextRangeValue,
    onChange: (value: ?TextRangeValue) => void,
    onBlur: (value: ?TextRangeValue, opts?: ?Object) => void,
}
class TextRangeField extends React.Component<Props> {
    touchedFields: Set<string>;
    constructor(props: Props) {
        super(props);
        this.touchedFields = new Set();
    }

    getValue = () => this.props.value || {};

    getNewValue = (key: string, newValue: any) => {
        const value = {
            ...this.getValue(),
            [key]: newValue,
        };
        if (!value.from && !value.to) {
            return null;
        }
        return value;
    }

    handleFromChange = (event: any) => {
        this.props.onChange({
            from: event.currentTarget.value,
            to: this.getValue().to,
        });
    }

    handleToChange = (event: any) => {
        this.props.onChange({
            from: this.getValue().from,
            to: event.currentTarget.value,
        });
    }

    handleFromBlur = (event: any) => {
        this.touchedFields.add('fromTouched');
        const currentValue = this.getValue();
        this.handleBlur({
            from: event.currentTarget.value,
            to: currentValue.to,
        }, !!currentValue.to);
    }

    handleToBlur = (event: any) => {
        this.touchedFields.add('toTouched');
        const currentValue = this.getValue();
        this.handleBlur({
            from: currentValue.from,
            to: event.currentTarget.value,
        }, !!currentValue.from);
    }

    handleBlur = (value: TextRangeValue, otherFieldHasValue: boolean) => {
        const touched = this.touchedFields.size === 2;
        if (!value.from && !value.to) {
            this.props.onBlur(undefined, {
                touched,
            });
            return;
        }
        this.props.onBlur(value, {
            touched: touched || otherFieldHasValue,
        });
    }

    getInnerMessage = (key: string) => {
        const { classes, innerMessage } = this.props;
        return (
            <InnerMessage
                classes={classes}
                messageKey={key}
                innerMessage={innerMessage}
            />
        );
    }


    render() {
        const { value, onChange, onBlur, ...passOnProps } = this.props;
        const fromValue = value && value.from ? value.from : '';
        const toValue = value && value.to ? value.to : '';
        return (
            <div className={defaultClasses.container}>
                <div className={defaultClasses.inputContainer}>
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                    <RangeInputField
                        label={i18n.t('From')}
                        onChange={this.handleFromChange}
                        onBlur={this.handleFromBlur}
                        value={fromValue}
                        {...passOnProps}
                    />
                    {this.getInnerMessage(inputKeys.FROM)}
                </div>
                <div className={defaultClasses.inputContainer}>
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                    <RangeInputField
                        label={i18n.t('To')}
                        onChange={this.handleToChange}
                        onBlur={this.handleToBlur}
                        value={toValue}
                        {...passOnProps}
                    />
                    {this.getInnerMessage(inputKeys.TO)}
                </div>
            </div>


        );
    }
}
export default TextRangeField;
