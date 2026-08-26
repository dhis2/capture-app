export type OrgUnit = {
    id: string;
    name: string;
    path: string;
};

export type OrgUnitFieldProps = {
    selected: { id: string; path: string[] };
    onSelectClick: (orgUnit: { id: string; path: string }) => void;
};
