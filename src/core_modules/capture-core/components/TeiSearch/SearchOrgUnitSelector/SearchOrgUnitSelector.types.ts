export type SearchOrgUnitSelectorProps = {
    searchId: string;
    selectedOrgUnit?: any;
    selectedOrgUnitScope?: string;
    treeRoots?: Array<any> | null;
    treeReady?: boolean;
    treeKey?: string;
    treeSearchText?: string;
    onSelectOrgUnitScope: (searchId: string, orgUnitScope: string) => void;
    onSetOrgUnit: (searchId: string, orgUnit?: any) => void;
    onFilterOrgUnits: (searchId: string, searchText?: string) => void;
    searchAttempted?: boolean;
};

export type SetOrgUnitScopePayload = {
    searchId: string;
    orgUnitScope: string;
};

export type SetOrgUnitPayload = {
    searchId: string;
    orgUnit?: any;
};

export type RequestFilterOrgUnitsPayload = {
    searchId: string;
    searchText: string;
};

export type FilteredOrgUnitsRetrievedPayload = {
    searchId: string;
    searchText: string;
    roots?: Array<any>;
};

export type FilterOrgUnitsFailedPayload = {
    searchId: string;
    error: any;
};

export type ClearOrgUnitsFilterPayload = {
    searchId: string;
};
