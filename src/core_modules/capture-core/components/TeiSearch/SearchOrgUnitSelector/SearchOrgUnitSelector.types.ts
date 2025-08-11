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
