// @flow

export type MiniMapProps = {
    coordinates: any,
    type: string,
    onSetCoordinates: (coordinates: ?[number, number] | ?Array<[number, number]>) => void,
    ...CssClasses
}

export type ModalProps = {
    center: ?[number, number],
    isOpen: boolean,
    type: string,
    defaultValues?: ?any,
    setOpen: (open: boolean) => void,
    onSetCoordinates: (coordinates: ?[number, number] | ?Array<[number, number]>) => void,
    ...CssClasses
}
