// @flow

export type CoordinatesProps = {
    center: ?[number, number],
    setOpen: (open: boolean) => void,
    onSetCoordinates: (coordinates: ?[number, number] | ?Array<[number, number]>) => void,
    defaultValues?: ?[number, number],
    ...CssClasses,
}

