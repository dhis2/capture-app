// @flow
import React from 'react';
import { CalendarInput } from '@dhis2/ui';

type ValidationOptions = {
    error?: ?string,
    errorCode?: ?string,
};

type ValidationProps = {|
    error: boolean,
    validationText: string,
|};

type Props = {
    value: ?Object,
    width: number,
    maxWidth?: ?string,
    calendarWidth?: ?string,
    inputWidth?: ?string,
    disabled?: ?boolean,
    onBlur: (value: Object, options: ValidationOptions) => void,
    onFocus?: ?() => void,
    onDateSelectedFromCalendar?: () => void,
    placeholder?: string,
    label?: string,
    calendarMax?: any,
    innerMessage?: any,
    dateFormat: ?string,
    calendarType: ?string,
    locale?: string,
    validation?: ?ValidationProps,
};

type Validation = {|
    validationCode: ?string,
    validationText: ?string,
    error?: boolean,
    valid: boolean,
|};

type State = {
    calendarError: ?Validation,
};

export class DateField extends React.Component<Props, State> {
    handleDateSelected: (value: {calendarDateString: string}) => void;

    constructor(props: Props) {
        super(props);

        this.handleDateSelected = this.handleDateSelected.bind(this);
    }

    handleDateSelected(value: { calendarDateString: string, validation: Validation}) {
        const { calendarDateString: date, validation } = value || {};
        this.props.onBlur(
            date, {
                error: validation?.validationText,
                errorCode: validation?.validationCode,
            });

        this.props.onDateSelectedFromCalendar && this.props.onDateSelectedFromCalendar();
    }

    render() {
        const {
            width = '100%',
            maxWidth,
            calendarWidth,
            inputWidth,
            calendarMax,
            value,
            innerMessage,
            calendarType,
            dateFormat,
            locale,
            validation,
        } = this.props;
        const calculatedInputWidth = inputWidth || width;
        const calculatedCalendarWidth = calendarWidth || width;
        const calendar = calendarType || 'gregory';
        const format = dateFormat || 'YYYY-MM-DD';
        const errorProps = validation || (innerMessage && innerMessage.messageType === 'error'
            ? { error: !!innerMessage.message?.dateInnerErrorMessage,
                validationText: innerMessage.message?.dateInnerErrorMessage }
            : {});

        return (
            <div
                style={{
                    width,
                    maxWidth,
                }}
            >
                <CalendarInput
                    label=""
                    placeholder={this.props.placeholder}
                    format={format}
                    onDateSelect={this.handleDateSelected}
                    calendar={calendar}
                    date={value}
                    width={String(calculatedCalendarWidth)}
                    inputWidth={String(calculatedInputWidth)}
                    onFocus={this.props.onFocus}
                    disabled={this.props.disabled}
                    {...errorProps}
                    maxDate={calendarMax}
                    locale={locale}
                />
            </div>
        );
    }
}
