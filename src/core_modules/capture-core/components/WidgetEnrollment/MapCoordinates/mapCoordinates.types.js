// @flow
import { dataElementTypes } from '../../../metaData';

type Feature = {
    type: string,
    properties: Object,
    geometry: {
        type: string,
        coordinates: Array<Array<Array<Number>>>,
    },
}

export type FeatureCollection = {
    type: string,
    features: Array<Feature>,
};

export type MiniMapProps = {
    coordinates: any,
    type: typeof dataElementTypes.COORDINATE | typeof dataElementTypes.POLYGON,
    onSetCoordinates: (coordinates: ?[number, number] | ?Array<[number, number]>) => void,
    ...CssClasses
}

export type ModalProps = {
    center: ?[number, number],
    isOpen: boolean,
    type: typeof dataElementTypes.COORDINATE | typeof dataElementTypes.POLYGON,
    defaultValues?: ?any,
    setOpen: (open: boolean) => void,
    onSetCoordinates: (coordinates: ?[number, number] | ?Array<[number, number]>) => void,
    ...CssClasses
}

export type MapCoordinatesProps = {|
    enrollment: Object,
    onUpdate: (arg: Object) => void,
    isOpenMap: boolean,
    setOpenMap: (toggle: boolean) => void,
|};
