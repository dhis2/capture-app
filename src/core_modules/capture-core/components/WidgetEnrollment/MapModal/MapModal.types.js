// @flow
import { dataElementTypes } from '../../../metaData';

export type MapModalComponentProps = {
    center: ?[number, number],
    type: typeof dataElementTypes.COORDINATE | typeof dataElementTypes.POLYGON,
    defaultValues?: ?Array<Array<number>> | ?[number, number],
    setOpen: (open: boolean) => void,
    onSetCoordinates: (coordinates: ?[number, number] | ?Array<[number, number]>) => void,
}

export type MapModalProps = {|
    center?: ?[number, number],
    enrollment: Object,
    onUpdate: (arg: Object) => void,
    setOpenMap: (toggle: boolean) => void,
    defaultValues?: ?Array<Array<number>> | ?[number, number],
|};
