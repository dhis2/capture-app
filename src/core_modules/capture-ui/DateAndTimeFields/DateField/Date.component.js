// @flow
import React from 'react';
import { CalendarInput } from '@dhis2/ui';
import { systemSettingsStore } from '../../../capture-core/metaDataMemoryStores';
import { errorMessages } from '../../../capture-core/components/D2Form/field/validators/getValidators';

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
    placeholder?: string,
    label?: string,
    calendarMaxMoment?: any,
};

type Validation = {|
    validationCode: string,
    validationText: string,
    error: boolean,
|};

type State = {
    calendarError: ?Validation,
};

const CUSTOM_VALIDATION_MESSAGES = {
    WRONG_FORMAT: errorMessages.DATE,
    // INVALID_DATE_MORE_THAN_MAX: errorMessages.DATE_FUTURE_NOT_ALLOWED,
};

const formatDate = (date: any, dateFormat: string): ?string =>
    (dateFormat === 'dd-MM-yyyy' ? date?.format('DD-MM-YYYY') : date?.format('YYYY-MM-DD'));

const getErrorMessage = (validation: ?Validation): ?string => {
    if (!validation) return undefined;

    const { validationCode, validationText } = validation;
    return CUSTOM_VALIDATION_MESSAGES[validationCode] || validationText || undefined;
};

export class DateField extends React.Component<Props, State> {
    handleDateSelected: (value: {calendarDateString: string}) => void;

    constructor(props: Props) {
        super(props);
        this.state = {
            calendarError: undefined,
        };
        this.handleDateSelected = this.handleDateSelected.bind(this);
    }

    // eslint-disable-next-line max-len
    handleDateSelected(value: { calendarDateString: string, validation: Validation}) {
        const { calendarDateString: selectedDate, validation } = value || {};

        if (selectedDate !== undefined) {
            const errorMessage = getErrorMessage(validation);
            this.setState({
                calendarError: errorMessage ? { ...validation, validationText: errorMessage } : null,
            });

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
            calendarMaxMoment,
        } = this.props;

        const calculatedInputWidth = inputWidth || width;
        const calculatedCalendarWidth = calendarWidth || width;
        const calendarType = calendar || 'gregory';
        const format = systemSettingsStore.get().dateFormat;
        const errorProps = this.state.calendarError
            ? { error: this.state.calendarError.error, validationText: this.state.calendarError.validationText }
            : {};

        return (
            <div
                style={{
                    width,
                    maxWidth,
                }}
            >
                <CalendarInput
                    label=""
                    placeholder={this.props.placeholder || this.props.label}
                    format={format}
                    onDateSelect={this.handleDateSelected}
                    calendar={calendarType}
                    date={this.props.value}
                    width={String(calculatedCalendarWidth)}
                    inputWidth={String(calculatedInputWidth)}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                    disabled={this.props.disabled}
                    {...errorProps}
                    maxDate={calendarMaxMoment && formatDate(calendarMaxMoment, format)}
                />
            </div>
        );
    }
}
