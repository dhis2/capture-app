export type DateTimeFilterData = {
    type: 'ABSOLUTE';
    ge?: string;
    le?: string;
} | {
    isEmpty: boolean;
    value: string;
};

export type DateTimeValue = {
    date?: string | null;
    time?: string | null;
    error?: string | null;
    isValid?: boolean | null;
};
