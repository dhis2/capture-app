type Feature = {
    type: string;
    properties: Record<string, any>;
    geometry: {
        type: string;
        coordinates: Array<Array<Array<number> | number>>;
    };
}

export type FeatureCollection = {
    type: string;
    features: Array<Feature>;
};

export type PolygonProps = {
    center?: [number, number] | null;
    setOpen: (open: boolean) => void;
    onSetCoordinates: (coordinates: [number, number] | Array<[number, number]> | null) => void;
    defaultValues?: Array<Array<number>> | null;
}
