// @flow
import * as React from 'react';
import { CalendarInput } from '@dhis2/ui';
import { systemSettingsStore } from '../../../../../capture-core/metaDataMemoryStores';

type Props = {
    label?: ?string,
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

type State = {
    date: ?string,
};

export class D2Date extends React.Component<Props, State> {
    handleDateSelected: (value: {calendarDateString: string}) => void;

    constructor(props: Props) {
        super(props);
        this.state = {
            date: props.value,
        };
        this.handleDateSelected = this.handleDateSelected.bind(this);
    }

    handleDateSelected(value: {calendarDateString: string}) {
        const selectedDate = value?.calendarDateString;
        this.setState({ date: selectedDate });
        if (selectedDate) {
            this.props.onBlur(selectedDate);
        }
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
            value,
            disabled,
            ...passOnProps
        } = this.props;

        const calculatedInputWidth = inputWidth || width;
        const calculatedCalendarWidth = calendarWidth || width;
        const calendarType = calendar || 'gregory';
        const format = systemSettingsStore.get().dateFormat;
        return (
            <div
                style={{
                    width,
                }}
            >
                <CalendarInput
                    {...passOnProps}
                    label={this.props.label}
                    format={format}
                    onDateSelect={this.handleDateSelected}
                    calendar={calendarType}
                    date={this.state.date}
                    width={String(calculatedCalendarWidth)}
                    inputWidth={String(calculatedInputWidth)}
                    onFocus={onFocus}
                    disabled={disabled}
                />
            </div>
        );
    }
}

