// @flow
import * as React from 'react';
import DateField from '../DateField/Date.component';
import withFocusSaver from '../../HOC/withFocusSaver';
import defaultClasses from './dateRangeField.mod.css';


const RangeInputField = withFocusSaver()(DateField);

type Props = {
    value: any,
    onBlur: (value: any) => void,
    onChange: (value: any) => void,
    classes: Object,
}

class DateRangeField extends React.Component<Props> {
    getNewValue = (newValues: Object) => {
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

    render() {
        const { onBlur, onChange, classes, value, ...passOnProps } = this.props;
        const fromValue = value && value.from ? value.from : '';
        const toValue = value && value.to ? value.to : '';
        return (
            <div className={defaultClasses.container}>
                <div className={defaultClasses.inputContainer}>
                    <RangeInputField
                        value={fromValue}
                        onBlur={(newFromValue) => { this.onBlur({ from: newFromValue }); }}
                        onChange={(newFromValue) => { this.onChange({ from: newFromValue }); }}
                        {...passOnProps}
                    />
                </div>
                <div className={defaultClasses.inputContainer}>
                    <RangeInputField
                        value={toValue}
                        onBlur={(newToValue) => { this.onBlur({ to: newToValue }); }}
                        onChange={(newToValue) => { this.onChange({ to: newToValue }); }}
                        {...passOnProps}
                    />
                </div>

            </div>
        );
    }
}
 
export default DateRangeField;