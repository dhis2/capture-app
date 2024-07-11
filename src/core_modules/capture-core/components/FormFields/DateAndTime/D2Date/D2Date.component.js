// @flow
import * as React from 'react';
import { CalendarInput } from '@dhis2/ui';

type Props = {
    label?: string,
    value: ?string,
    width: number,
    calendar?: string,
    calendarWidth?: ?number,
    calendarHeight?: ?number,
    inputWidth?: ?number,
    onBlur: (value: string) => void,
    onFocus?: ?() => void,
    onDateSelectedFromCalendar?: () => void,
    classes?: Object,
    disabled?: boolean,
};

export class D2Date extends React.Component<Props> {
    handleDateSelected: (value: {calendarDateString: string}) => void;

    constructor(props: Props) {
        super(props);

        this.handleDateSelected = this.handleDateSelected.bind(this);
    }

    handleDateSelected(value: {calendarDateString: string}) {
        const date = value?.calendarDateString;
        this.props.onBlur(date);
        this.props.onDateSelectedFromCalendar && this.props.onDateSelectedFromCalendar();
    }

    render() {
        const {
            width,
            calendar,
            calendarWidth,
            inputWidth,
            classes,
            onBlur,
            onFocus,
            onDateSelectedFromCalendar,
            ...passOnProps
        } = this.props;

        const calculatedInputWidth = inputWidth || width;
        const calculatedCalendarWidth = calendarWidth || width;
        const calendarType = calendar || 'gregory';

        return (
            <div
                style={{
                    width,
                }}
            >
                <CalendarInput
                    label=""
                    {...passOnProps}
                    onDateSelect={this.handleDateSelected}
                    calendar={calendarType}
                    date={this.props.value}
                    width={String(calculatedCalendarWidth)}
                    inputWidth={String(calculatedInputWidth)}
                    onFocus={this.props.onFocus}
                    editable
                    disabled={this.props.disabled}
                />
            </div>
        );
    }
}

