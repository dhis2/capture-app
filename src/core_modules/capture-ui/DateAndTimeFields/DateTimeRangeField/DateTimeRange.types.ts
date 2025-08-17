export type DateTimeValue = {
    date?: string | null | undefined;
    time?: string | null | undefined;
};

export type DateTimeRangeValue = {
    from?: DateTimeValue | null | undefined;
    to?: DateTimeValue | null | undefined;
};

export type Props = {
    classes?: any | null | undefined;
    innerMessage?: any | null | undefined;
    value: DateTimeRangeValue;
    onBlur: (value: DateTimeRangeValue | null | undefined, options: any) => void;
    onChange: (value: DateTimeRangeValue | null | undefined) => void;
    locale?: string;
};

export type State = {
    fromDateError: {
        error: string | null | undefined;
        errorCode: string | null | undefined;
    };
    toDateError: {
        error: string | null | undefined;
        errorCode: string | null | undefined;
    };
};
