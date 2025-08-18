import type { orientations } from '../../constants/orientations.const';

export type Value = {
    date?: string | null;
    time?: string | null;
};

export type Props = {
    onBlur: (value: Value | null | undefined, options?: any, internalError?: any) => void;
    onChange: (value?: Value | null) => void;
    value: Value;
    orientation: typeof orientations[keyof typeof orientations];
    classes: any;
    dateLabel?: string;
    timeLabel?: string;
    innerMessage: any;
    locale?: string;
    shrinkDisabled: boolean;
    disabled: boolean;
};
