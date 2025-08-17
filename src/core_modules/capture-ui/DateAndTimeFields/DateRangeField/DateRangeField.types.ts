export type DateRangeValue = {
    from?: string | null | undefined;
    to?: string | null | undefined;
};

export type State = {
    fromError: { error: string | null | undefined, errorCode: string | null | undefined };
    toError: { error: string | null | undefined, errorCode: string | null | undefined };
};

export type Props = {
    value: DateRangeValue;
    onBlur: (value: DateRangeValue | null | undefined, opts: any) => void;
    onChange: (value: DateRangeValue | null | undefined) => void;
    classes: any;
    innerMessage?: any | null | undefined;
    locale?: string;
};
