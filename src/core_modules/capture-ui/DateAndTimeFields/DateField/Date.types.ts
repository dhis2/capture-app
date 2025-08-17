export type ValidationOptions = {
    error?: string | null | undefined;
    errorCode?: string | null | undefined;
};

export type ValidationProps = {
    error: boolean;
    validationText: string;
};

export type Validation = {
    validationCode: string | null | undefined;
    validationText: string | null | undefined;
    error?: boolean;
    valid: boolean;
};

export type Props = {
    value: any | null | undefined;
    width: number;
    maxWidth?: string | null | undefined;
    calendarWidth?: string | null | undefined;
    inputWidth?: string | null | undefined;
    disabled?: boolean | null | undefined;
    onBlur: (value: any, options: ValidationOptions) => void;
    onFocus?: (() => void) | null | undefined;
    onDateSelectedFromCalendar?: () => void;
    placeholder?: string;
    label?: string;
    calendarMax?: any;
    innerMessage?: any;
    dateFormat: string | null | undefined;
    calendarType: string | null | undefined;
    locale?: string;
    validation?: ValidationProps | null | undefined;
};

export type State = {
    calendarError: Validation | null | undefined;
};
