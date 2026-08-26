export type DateRangeValue = {
    from?: string | null;
    to?: string | null;
};

export type State = {
    fromError: { error?: string | null, errorCode?: string | null };
    toError: { error?: string | null, errorCode?: string | null };
};

export type Props = {
    value: DateRangeValue;
    onBlur: (value: DateRangeValue | null | undefined, opts?: any) => void;
    onChange: (value?: DateRangeValue | null) => void;
    classes: any;
    innerMessage?: any | null;
    locale?: string;
};
