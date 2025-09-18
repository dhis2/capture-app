
export type ValidationOptions = {
    error?: string | null;
    errorCode?: string | null;
};

export type ValidationProps = {
    error: boolean;
    validationText: string;
};

export type Props = {
    value?: any | null;
    width: number;
    maxWidth?: string | number | null;
    calendarWidth?: string | null;
    inputWidth?: string | null;
    disabled?: boolean | null;
    onBlur: (value: any, options: ValidationOptions) => void;
    onFocus?: () => void | null;
    onDateSelectedFromCalendar?: () => void;
    placeholder?: string;
    label?: string;
    calendarMax?: any;
    innerMessage?: any;
    dateFormat?: 'YYYY-MM-DD' | 'DD-MM-YYYY' | null;
    calendarType?: 'gregory' | 'iso8601' | 'hebrew' | 'islamic' | 'islamic-umalqura' | 'islamic-tbla' | 
        'islamic-civil' | 'islamic-rgsa' | 'persian' | 'ethiopic' | 'ethioaa' | 'coptic' | 'chinese' | null;
    locale?: string;
    validation?: ValidationProps | null;
};

export type Validation = {
    validationCode?: string | null;
    validationText?: string | null;
    error?: boolean;
    valid: boolean;
};

export type State = {
    calendarError?: Validation | null;
};
