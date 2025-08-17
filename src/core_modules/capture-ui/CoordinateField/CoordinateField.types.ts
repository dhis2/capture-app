import type { Orientation } from '../constants/orientations.const';

export type Coordinate = {
    latitude?: string | null | undefined;
    longitude?: string | null | undefined;
};

export type Props = {
    onBlur: (value: any) => void;
    value: Coordinate;
    orientation: Orientation;
    shrinkDisabled: boolean;
    classes: any;
    disabled: boolean;
    mapHeight: number;
    mapWidth: number;
    latitudeLabel?: string;
    longitudeLabel?: string;
    innerMessage?: any;
};

export type State = {
    mapOpen: boolean;
    position: [number, number];
};
