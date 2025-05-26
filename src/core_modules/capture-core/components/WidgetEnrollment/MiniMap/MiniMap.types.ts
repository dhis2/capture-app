import { dataElementTypes } from '../../../metaData';

export type QueryRefetchFunction = (options?: Record<string, any>) => Promise<any>;

export type OwnProps = {
    coordinates: Array<Array<[number, number]>>;
    enrollment: any;
    refetchEnrollment: QueryRefetchFunction;
    refetchTEI: QueryRefetchFunction;
    onError?: (message: string) => void;
    geometryType: typeof dataElementTypes.COORDINATE | typeof dataElementTypes.POLYGON;
};
