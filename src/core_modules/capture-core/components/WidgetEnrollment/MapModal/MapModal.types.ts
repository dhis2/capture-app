import { dataElementTypes } from '../../../metaData';

export type MapModalComponentProps = {
    center?: [number, number] | null;
    type: typeof dataElementTypes.COORDINATE | typeof dataElementTypes.POLYGON;
    defaultValues?: number[][] | [number, number] | null;
    setOpen: (open: boolean) => void;
    onSetCoordinates: (coordinates: [number, number] | [number, number][] | null) => void;
}

export type MapModalProps = {
    center?: [number, number] | null;
    enrollment: Record<string, any>;
    onUpdate: (arg: Record<string, any>) => void;
    setOpenMap: (toggle: boolean) => void;
    defaultValues?: number[][] | [number, number] | null;
};
