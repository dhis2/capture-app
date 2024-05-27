// @flow
import React from 'react';
import { CalendarInput } from '@dhis2/ui';

type Props = {
    value: ?string,
    width: string,
    maxWidth?: ?number,
    calendarWidth?: ?number,
    inputWidth?: ?number,
    disabled?: ?boolean,
    onBlur: (value: string) => void,
    onFocus?: ?() => void,
    onDateSelectedFromCalendar?: () => void,
    calendar: string,
};

export class DateField extends React.Component<Props, State> {
    containerInstance: ?HTMLElement;
    handleDateSelected: (value: string) => void;

    constructor(props: Props) {
        super(props);

        this.handleDateSelected = this.handleDateSelected.bind(this);
    }

    handleDateSelected(value) {
        const date = value?.calendarDateString;
        this.props.onBlur(date);
        this.props.onDateSelectedFromCalendar && this.props.onDateSelectedFromCalendar();
    }

    render() {
        const {
            width,
            maxWidth,
            calendarWidth,
            inputWidth,
            onBlur,
            onFocus,
            onDateSelectedFromCalendar,
            calendar,
            ...passOnProps
        } = this.props;
        const calculatedInputWidth = inputWidth || width;
        const calculatedCalendarWidth = calendarWidth || width;
        const calendarType = calendar || 'gregory';
        return (
            <div
                ref={(containerInstance) => { this.containerInstance = containerInstance; }}
                style={{
                    width,
                    maxWidth,
                }}
                disabled={this.props.disabled}
            >
                <CalendarInput
                    onDateSelect={this.handleDateSelected}
                    calendar={calendarType}
                    date={this.props.value}
                    width={String(calculatedCalendarWidth)}
                    inputWidth={String(calculatedInputWidth)}
                    onFocus={this.props.onFocus}
                    editable
                    {...passOnProps}
                />
            </div>
        );
    }
}
