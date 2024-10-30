// @flow
import * as React from 'react';
import { CalendarInput } from '@dhis2/ui';
import { systemSettingsStore } from '../../../../../capture-core/metaDataMemoryStores';
import { type DateValue } from '../../../FiltersForTypes/Date/types/date.types';

type Props = {
    label?: ?string,
    value: ?string,
    calendar?: string,
    calendarWidth?: ?number,
    inputWidth?: ?number,
    onBlur: (value: DateValue) => void,
    onFocus?: ?() => void,
    onDateSelectedFromCalendar?: () => void,
    classes?: Object,
    disabled?: boolean,
};

type State = {
    date: ?string,
};

type Validation = {|
    validationCode: string,
    validationText: string,
    error: boolean,
    valid: boolean,
|};

export class D2Date extends React.Component<Props, State> {
    handleDateSelected: (value: {calendarDateString: string}) => void;

    constructor(props: Props) {
        super(props);
        this.handleDateSelected = this.handleDateSelected.bind(this);
    }

    handleDateSelected(value: {calendarDateString: string, validation: Validation}) {
        const { calendarDateString: selectedDate, validation } = value || {};
        if (selectedDate !== undefined) {
            this.props.onBlur({
                value: selectedDate,
                error: validation?.validationText,
                isValid: validation?.valid,
            });
        }
        this.props.onDateSelectedFromCalendar && this.props.onDateSelectedFromCalendar();
    }

    render() {
        const {
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

        const calendarType = calendar || 'gregory';
        const format = systemSettingsStore.get().dateFormat;

        return (
            <div>
                <CalendarInput
                    {...passOnProps}
                    label={this.props.label}
                    format={format}
                    onDateSelect={this.handleDateSelected}
                    calendar={calendarType}
                    date={this.props.value}
                    width={String(calendarWidth)}
                    inputWidth={String(inputWidth)}
                    onFocus={onFocus}
                    disabled={disabled}
                />
            </div>
        );
    }
}

