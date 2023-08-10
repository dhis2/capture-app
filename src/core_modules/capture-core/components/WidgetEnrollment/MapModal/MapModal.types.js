// @flow
import { dataElementTypes } from '../../../metaData';

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

export type ModalProps = {
    center: ?[number, number],
    isOpen: boolean,
    type: typeof dataElementTypes.COORDINATE | typeof dataElementTypes.POLYGON,
    defaultValues?: ?Array<Array<number>> | ?[number, number],
    setOpen: (open: boolean) => void,
    onSetCoordinates: (coordinates: ?[number, number] | ?Array<[number, number]>) => void,
}

export type PolygonProps = {
    center: ?[number, number],
    isOpen: boolean,
    setOpen: (open: boolean) => void,
    onSetCoordinates: (coordinates: ?[number, number] | ?Array<[number, number]>) => void,
    defaultValues?: ?Array<Array<number>>,
    ...CssClasses,
}

export type CoordinatesProps = {
    center: ?[number, number],
    isOpen: boolean,
    setOpen: (open: boolean) => void,
    onSetCoordinates: (coordinates: ?[number, number] | ?Array<[number, number]>) => void,
    defaultValues?: ?[number, number],
    ...CssClasses,
}
export type MapModalProps = {|
    center?: ?[number, number],
    enrollment: Object,
    onUpdate: (arg: Object) => void,
    isOpenMap: boolean,
    setOpenMap: (toggle: boolean) => void,
    defaultValues?: ?Array<Array<number>> | ?[number, number],
|};
