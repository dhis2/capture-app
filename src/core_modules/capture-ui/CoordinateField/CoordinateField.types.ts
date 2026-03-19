import type { ReactElement } from 'react';
import type { orientations } from '../constants/orientations.const';

export type Coordinate = {
    latitude?: string | null;
    longitude?: string | null;
};

export type PlainProps = {
    onBlur: (value: any) => void;
    onOpenMap?: (hasValue: boolean) => void;
    onCloseMap?: () => void;
    orientation: typeof orientations[keyof typeof orientations];
    center?: Array<number> | null;
    onChange?: (value: any) => void | null;
    value?: Coordinate | null;
    shrinkDisabled?: boolean | null;
    classes?: any;
    mapDialog: ReactElement<any>;
    disabled?: boolean | null;
    rtl?: boolean;
};

export type State = {
    showMap?: boolean | null;
    position?: Array<number> | null;
    zoom: number;
};
