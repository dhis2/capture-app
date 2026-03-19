export type DateTimeValue = {
    date?: string | null;
    time?: string | null;
};

export type DateTimeRangeValue = {
    from?: DateTimeValue | null;
    to?: DateTimeValue | null;
};

export type Props = {
    classes?: any | null;
    innerMessage?: any | null;
    value: DateTimeRangeValue;
    onBlur: (value: DateTimeRangeValue | null | undefined, options?: any) => void;
    onChange: (value?: DateTimeRangeValue | null) => void;
    locale?: string;
};

export type State = {
    fromDateError: {
        error?: string | null;
        errorCode?: string | null;
    };
    toDateError: {
        error?: string | null;
        errorCode?: string | null;
    };
};
