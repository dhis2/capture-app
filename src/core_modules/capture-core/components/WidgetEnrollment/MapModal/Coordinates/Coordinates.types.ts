export type CoordinatesProps = {
    center: [number, number] | null;
    setOpen: (open: boolean) => void;
    onSetCoordinates: (coordinates: [number, number] | Array<[number, number]> | null) => void;
    defaultValues?: [number, number] | null;
};
