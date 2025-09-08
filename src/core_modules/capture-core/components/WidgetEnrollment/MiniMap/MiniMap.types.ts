import type { QueryRefetchFunction } from '../../../../capture-core-utils/types';
import { dataElementTypes } from '../../../metaData';

export type OwnProps = {
    coordinates: Array<Array<[number, number]>>;
    enrollment: any;
    refetchEnrollment: QueryRefetchFunction;
    refetchTEI: QueryRefetchFunction;
    onError?: (message: string) => void;
    geometryType: typeof dataElementTypes.COORDINATE | typeof dataElementTypes.POLYGON;
};
