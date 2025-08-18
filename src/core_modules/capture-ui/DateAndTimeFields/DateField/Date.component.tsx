import React from 'react';
import { CalendarInput } from '@dhis2/ui';
import type { Props, State, Validation } from './Date.types';

export class DateField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.handleDateSelected = this.handleDateSelected.bind(this);
    }

    handleDateSelected = (value: { calendarDateString: string, validation: Validation}) => {
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
            value,
            innerMessage,
            calendarType,
            dateFormat,
            locale,
            validation,
        } = this.props;
        const calculatedInputWidth = inputWidth || width;
        const calculatedCalendarWidth = calendarWidth || width;
        const calendar = (calendarType || 'gregory') as any;
        const format = (dateFormat || 'YYYY-MM-DD') as any;
        const errorProps = validation || (innerMessage && innerMessage.messageType === 'error'
            ? { error: !!innerMessage.message?.dateInnerErrorMessage,
                validationText: innerMessage.message?.dateInnerErrorMessage }
            : {});

        return (
            <div
                style={{
                    width,
                    maxWidth: maxWidth || undefined,
                }}
            >
                <CalendarInput
                    label=""
                    placeholder={this.props.placeholder}
                    format={format}
                    onDateSelect={this.handleDateSelected as any}
                    calendar={calendar}
                    date={value}
                    width={String(calculatedCalendarWidth)}
                    inputWidth={String(calculatedInputWidth)}
                    onFocus={this.props.onFocus}
                    disabled={!!this.props.disabled}
                    locale={locale}
                    {...errorProps as any}
                />
            </div>
        );
    }
}
