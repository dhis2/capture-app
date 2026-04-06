import type { EmptyValueFilterData } from '../../EmptyValue/types';

export type OrgUnitValue = {
    id: string;
    name: string;
    path: string;
};

export type OrgUnitIdFilterData = {
    value: string;
    name?: string;
};

export type OrgUnitFilterData = OrgUnitIdFilterData | EmptyValueFilterData;
