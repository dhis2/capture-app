import type { QuerySingleResource } from 'capture-core/utils/api/api.types';
import type { Option } from '../../../metaData';

export type Geometry = {
    type: string;
    coordinates: Array<Array<Array<number>>> | { latitude: number; longitude: number };
};

export type Attribute = {
    id: string;
    value: string;
    teiId: string;
    programId: string;
    absoluteApiPath: string;
};

export type SubValueFunctionParams = {
    attribute: Attribute;
    querySingleResource: QuerySingleResource;
};

export type InputProgramData = {
    id: string;
    programTrackedEntityAttributes: Array<{
        trackedEntityAttribute: {
            id: string;
            displayFormName?: string;
            optionSet?: {
                id?: string;
                options: Array<Option>;
            };
            valueType: string;
            unique: boolean;
        };
        displayInList: boolean;
    }>;
};

export type InputAttribute = {
    attribute: string;
    value: string;
};
