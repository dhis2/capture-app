import * as React from 'react';
import { CalendarInput } from '@dhis2/ui';
import { systemSettingsStore } from '../../../../../capture-core/metaDataMemoryStores';
import type { DateValue } from '../../../FiltersForTypes/Date/types/date.types';

type Props = {
    label?: string;
    value?: string;
    calendarWidth?: number;
    inputWidth?: number;
    onBlur: (value: DateValue) => void;
    onFocus?: () => void;
    onDateSelectedFromCalendar?: () => void;
    classes?: Record<string, unknown>;
    disabled?: boolean;
};

type State = {
    date?: string;
};


export class D2Date extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    handleDateSelected = (value: any) => {
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

        const calendarType = systemSettingsStore.get().calendar || 'gregory';
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
                    width={calendarWidth?.toString()}
                    inputWidth={inputWidth?.toString()}
                    onFocus={onFocus}
                    disabled={disabled}
                />
            </div>
        );
    }
}

