// @flow

export type MiniMapProps = {
    coordinates: any,
    type: string,
    classes: Object,
    onSetCoordinates: (coordinates: ?[number, number] | ?Array<[number, number]>) => void,
}

export type ModalProps = {
    center: ?[number, number],
    isOpen: boolean,
    type: string,
    setOpen: (open: boolean) => void,
    onSetCoordinates: (coordinates: ?[number, number] | ?Array<[number, number]>) => void,
    classes: Object
}
