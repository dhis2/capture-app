import type { EmptyValueFilterData } from '../../EmptyValue/types';

export type OrgUnitValue = {
    id: string;
    name: string;
    path: string;
};

export type OrgUnitValueFilterData = {
    value: string;
    name?: string;
};

export type OrgUnitFilterData = OrgUnitValueFilterData | EmptyValueFilterData;
