import * as React from 'react';
import { CalendarInput } from '@dhis2/ui';
import { systemSettingsStore } from 'capture-core/metaDataMemoryStores';
import type { DateValue } from '../../../FiltersForTypes/Date/types/date.types';

type Props = {
    label?: string;
    value?: string;
    calendarWidth?: string;
    inputWidth?: string;
    onBlur: (value: DateValue) => void;
    onFocus?: () => void;
    onDateSelectedFromCalendar?: () => void;
    disabled?: boolean;
    placeholder?: string;
};

type State = {
    date?: string;
};

type Validation = {
    validationCode: string,
    validationText: string,
    error: boolean,
    valid: boolean,
};

export class D2Date extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    handleDateSelected = (value: {calendarDateString: string, validation?: Validation} | null) => {
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
            onBlur,
            onFocus,
            onDateSelectedFromCalendar,
            value,
            disabled,
            ...passOnProps
        } = this.props;

        const systemSettings = systemSettingsStore.get();
        const calendarType: any = systemSettings.calendar || 'gregory';
        const format: any = systemSettings.dateFormat;
        const locale = systemSettings.uiLocale;

        return (
            <div>
                <CalendarInput
                    {...passOnProps}
                    label={this.props.label}
                    format={format}
                    onDateSelect={this.handleDateSelected}
                    calendar={calendarType}
                    date={this.props.value}
                    width={calendarWidth}
                    inputWidth={inputWidth}
                    onFocus={onFocus}
                    disabled={disabled}
                    locale={locale}
                />
            </div>
        );
    }
}

