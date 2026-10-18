import { dataElementTypes } from '../../../metaData';

export type OwnProps = {
    coordinates: Array<Array<[number, number]>>;
    enrollment: any;
    updateEnrollmentGeometry: (geometry: Record<string, unknown> | null) => void;
    geometryType: typeof dataElementTypes.COORDINATE | typeof dataElementTypes.POLYGON;
    readOnly: boolean;
};
