export type CoordinatesProps = {
    center: [number, number] | null;
    setOpen: (open: boolean) => void;
    onSetCoordinates: (coordinates: [number, number] | null | Array<[number, number]> | null) => void;
    defaultValues?: [number, number] | null;
    classes: Record<string, string>;
};
