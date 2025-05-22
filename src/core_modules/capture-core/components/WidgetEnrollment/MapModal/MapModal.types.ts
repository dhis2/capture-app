import { dataElementTypes } from '../../../metaData';

export type MapModalComponentProps = {
    center?: [number, number] | null;
    type: typeof dataElementTypes.COORDINATE | typeof dataElementTypes.POLYGON;
    defaultValues?: Array<Array<number>> | [number, number] | null;
    setOpen: (open: boolean) => void;
    onSetCoordinates: (coordinates: [number, number] | Array<[number, number]> | null) => void;
};

export type EnrollmentWithGeometry = {
    orgUnit: string;
    program: string;
    geometry?: {
        type: string;
        coordinates: any[];
    };
    [key: string]: any;
};

export type MapModalProps = {
    center?: [number, number];
    enrollment: EnrollmentWithGeometry;
    onUpdate: (arg: Object) => void;
    setOpenMap: (toggle: boolean) => void;
    defaultValues?: Array<Array<number>> | [number, number];
};
