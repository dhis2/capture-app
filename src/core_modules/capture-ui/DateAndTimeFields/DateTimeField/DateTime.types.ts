import type { Orientation } from '../../constants/orientations.const';

export type Value = {
    date?: string | null | undefined;
    time?: string | null | undefined;
};

export type Props = {
    onBlur: (value: Value | null | undefined, options: any, internalError: any) => void;
    onChange: (value: Value | null | undefined) => void;
    value: Value;
    orientation: Orientation;
    classes: any;
    dateLabel?: string;
    timeLabel?: string;
    innerMessage: any;
    locale?: string;
    shrinkDisabled: boolean;
    disabled: boolean;
};
