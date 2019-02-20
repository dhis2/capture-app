// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import DateField from '../DateField/Date.component';
import withFocusSaver from '../../HOC/withFocusSaver';
import withShrinkLabel from '../../HOC/withShrinkLabel';
import defaultClasses from './dateRangeField.mod.css';
import InnerMessage from '../../internal/InnerMessage/InnerMessage.component';


const RangeInputField = withFocusSaver()(withShrinkLabel()(DateField));

type DateRangeValue = {
    from?: ?string,
    to?: ?string,
}

type Props = {
    value: DateRangeValue,
    onBlur: (value: ?DateRangeValue, opts: any) => void,
    onChange: (value: ?DateRangeValue) => void,
    classes: Object,
    innerMessage?: ?Object,
}

const inputKeys = {
    FROM: 'from',
    TO: 'to',
};


class DateRangeField extends React.Component<Props> {
    static defaultProps = {
        value: {},
    }
    touchedFields: Set<string>;
    constructor(props: Props) {
        super(props);
        this.touchedFields = new Set();
    }

    handleFromChange = (value: string) => {
        this.props.onChange({
            from: value,
            to: this.props.value.to,
        });
    }

    handleToChange = (value: string) => {
        this.props.onChange({
            from: this.props.value.from,
            to: value,
        });
    }

    handleFromBlur = (value: string) => {
        this.touchedFields.add('fromTouched');
        this.handleBlur({
            from: value,
            to: this.props.value.to,
        }, !!this.props.value.to);
    }

    handleToBlur = (value: string) => {
        this.touchedFields.add('toTouched');
        this.handleBlur({
            from: this.props.value.from,
            to: value,
        }, !!this.props.value.from);
    }

    handleBlur = (value: DateRangeValue, otherFieldHasValue: boolean) => {
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
        const { onBlur, onChange, value, innerMessage, ...passOnProps } = this.props;
        const fromValue = value && value.from ? value.from : '';
        const toValue = value && value.to ? value.to : '';
        return (
            <div className={defaultClasses.container}>
                <div className={defaultClasses.inputContainer}>
                    <RangeInputField
                        label={i18n.t('From')}
                        value={fromValue}
                        onBlur={this.handleFromBlur}
                        onChange={this.handleFromChange}
                        {...passOnProps}
                    />
                    {this.getInnerMessage(inputKeys.FROM)}
                </div>
                <div className={defaultClasses.inputContainer}>
                    <RangeInputField
                        label={i18n.t('To')}
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
export default DateRangeField;
