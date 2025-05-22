import type { QueryRefetchFunction } from '../enrollment.types';
import { dataElementTypes } from '../../../metaData';

export type MiniMapProps = {
    coordinates: Array<Array<number[]>>;
    enrollment: any;
    refetchEnrollment: QueryRefetchFunction;
    refetchTEI: QueryRefetchFunction;
    onError?: (message: string) => void;
    geometryType: typeof dataElementTypes.COORDINATE | typeof dataElementTypes.POLYGON;
    classes?: {
        mapContainer?: string;
        map?: string;
    };
};
