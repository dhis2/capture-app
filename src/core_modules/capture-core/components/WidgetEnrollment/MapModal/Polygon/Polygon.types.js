// @flow

type Feature = {
    type: string,
    properties: Object,
    geometry: {
        type: string,
        coordinates: Array<Array<Array<number> | number>>,
    },
}

export type FeatureCollection = {
    type: string,
    features: Array<Feature>,
};

export type PolygonProps = {
    center: ?[number, number],
    setOpen: (open: boolean) => void,
    onSetCoordinates: (coordinates: ?[number, number] | ?Array<[number, number]>) => void,
    defaultValues?: ?Array<Array<number>>,
    ...CssClasses,
}

