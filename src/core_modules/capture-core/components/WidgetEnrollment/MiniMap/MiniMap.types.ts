import { WithStyles } from '@material-ui/core';
import { dataElementTypes } from '../../../metaData';

export type QueryRefetchFunction = (options?: Record<string, any>) => Promise<any>;

export type MiniMapProps = {
    coordinates: Array<Array<[number, number]>>;
    enrollment: any;
    refetchEnrollment: QueryRefetchFunction;
    refetchTEI: QueryRefetchFunction;
    onError?: (message: string) => void;
    geometryType: typeof dataElementTypes.COORDINATE | typeof dataElementTypes.POLYGON;
} & WithStyles<typeof styles>;

export type OwnProps = Omit<MiniMapProps, 'classes'>;

export const styles = {
    mapContainer: {
        width: 150,
        height: 120,
    },
    map: {
        width: '100%',
        height: '100%',
    },
};
