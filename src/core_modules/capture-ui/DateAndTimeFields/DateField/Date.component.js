// @flow
import React from 'react';
import { CalendarInput } from '@dhis2/ui';
import { systemSettingsStore } from '../../../capture-core/metaDataMemoryStores';

type Props = {
    value: ?string,
    width: number,
    maxWidth?: ?number,
    calendarWidth?: ?number,
    inputWidth?: ?number,
    disabled?: ?boolean,
    onBlur: (value: string) => void,
    onFocus?: ?() => void,
    onDateSelectedFromCalendar?: () => void,
    calendar?: string,
    placeholder?: string
};

export class DateField extends React.Component<Props> {
    handleDateSelected: (value: {calendarDateString: string}) => void;

    constructor(props: Props) {
        super(props);

        this.handleDateSelected = this.handleDateSelected.bind(this);
    }

    handleDateSelected(value: {calendarDateString: string}) {
        const selectedDate = value?.calendarDateString;
        if (selectedDate !== undefined) {
            this.props.onBlur(selectedDate);
        }

        this.props.onDateSelectedFromCalendar && this.props.onDateSelectedFromCalendar();
    }

    render() {
        const {
            width,
            maxWidth,
            calendarWidth,
            inputWidth,
            calendar,
        } = this.props;

        const calculatedInputWidth = inputWidth || width;
        const calculatedCalendarWidth = calendarWidth || width;
        const calendarType = calendar || 'gregory';
        const format = systemSettingsStore.get().dateFormat;

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
                    calendar={calendarType}
                    date={this.props.value}
                    width={String(calculatedCalendarWidth)}
                    inputWidth={String(calculatedInputWidth)}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                    disabled={this.props.disabled}
                />
            </div>
        );
    }
}
