import type { Orientation } from '../constants/orientations.const';

export type AgeValues = {
    date?: string | null | undefined;
    years?: string | null | undefined;
    months?: string | null | undefined;
    days?: string | null | undefined;
};

export type Props = {
    onBlur: (value: AgeValues | null | undefined) => void;
    value: AgeValues;
    orientation: Orientation;
    shrinkDisabled: boolean;
    classes: any;
    disabled: boolean;
    calendarType: string | null | undefined;
    dateFormat: string | null | undefined;
    locale?: string;
    innerMessage?: any;
};

export type State = {
    ageInputType: string;
};
