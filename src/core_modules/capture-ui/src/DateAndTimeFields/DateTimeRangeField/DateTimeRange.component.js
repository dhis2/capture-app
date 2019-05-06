// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import DateTimeField from '../DateTimeField/DateTime.component';
import withFocusSaver from '../../HOC/withFocusSaver';
import defaultClasses from './dateTimeRangeField.mod.css';
import InnerMessage from '../../internal/InnerMessage/InnerMessage.component';

const RangeInputField = withFocusSaver()(DateTimeField);


type DateTimeValue = {
    date?: ?string,
    time?: ?string,
};

type DateTimeRangeValue = {
    from?: ?DateTimeValue,
    to?: ?DateTimeValue,
}

type BlurOpts = {
    touched?: ?boolean,
}

type Props = {
    classes?: ?Object,
    innerMessage?: ?Object,
    value: DateTimeRangeValue,
    onBlur: (value: ?DateTimeRangeValue, options: Object) => void,
    onChange: (value: ?DateTimeRangeValue) => void,
}

const inputKeys = {
    FROM: 'from',
    TO: 'to',
};

class DateTimeRangeField extends React.Component<Props> {
    touchedFields: Set<string>;
    constructor(props: Props) {
        super(props);
        this.touchedFields = new Set();
    }


    getValue = () => this.props.value || {};


    getNewValue = (key: string, newValue: any) => {
        const currentValue = this.getValue();
        const value = {
            ...currentValue,
            [key]: newValue,
        };
        if (!value.from && !value.to) {
            return null;
        }
        return value;
    }

    handleFromChange = (value: ?DateTimeValue) => {
        this.props.onChange({
            from: value,
            to: this.getValue().to,
        });
    }
    handleToChange = (value: ?DateTimeValue) => {
        this.props.onChange({
            from: this.getValue().from,
            to: value,
        });
    }

    toHasValue = () => {
        const value = this.getValue();
        return !!(value.to && value.to.date && value.to.time);
    }

    fromHasValue = () => {
        const value = this.getValue();
        return !!(value.to && value.to.date && value.to.time);
    }

    handleFromBlur = (value: ?DateTimeValue, opts?: ?BlurOpts) => {
        if (opts && opts.touched) {
            this.touchedFields.add('fromTouched');
        }
        this.handleBlur({
            from: value,
            to: this.getValue().to,
        }, this.toHasValue());
    }

    handleToBlur = (value: ?DateTimeValue, opts?: ?BlurOpts) => {
        if (opts && opts.touched) {
            this.touchedFields.add('toTouched');
        }
        this.handleBlur({
            from: this.getValue().from,
            to: value,
        }, this.fromHasValue());
    }

    handleBlur = (value: DateTimeRangeValue, otherFieldHasValue: boolean) => {
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
                innerMessage={innerMessage}
                messageKey={key}
            />
        );
    }

    render() {
        const { onBlur, onChange, value, ...passOnProps } = this.props;
        const fromValue = value && value.from ? value.from : '';
        const toValue = value && value.to ? value.to : '';

        return (
            <div className={defaultClasses.container}>
                <div className={defaultClasses.inputContainer}>
                    <RangeInputField
                        dateLabel={i18n.t('From date')}
                        timeLabel={i18n.t('From time')}
                        value={fromValue}
                        onBlur={this.handleFromBlur}
                        onChange={this.handleFromChange}
                        {...passOnProps}
                    />
                    {this.getInnerMessage(inputKeys.FROM)}
                </div>
                <div className={defaultClasses.inputContainer}>
                    <RangeInputField
                        dateLabel={i18n.t('To date')}
                        timeLabel={i18n.t('To time')}
                        value={toValue}
                        onBlur={this.handleToBlur}
                        onChange={this.handleToChange}
                        {...passOnProps}
                    />
                    {this.getInnerMessage(inputKeys.TO)}
                </div>

            </div>
        );
    }
}
export default DateTimeRangeField;
