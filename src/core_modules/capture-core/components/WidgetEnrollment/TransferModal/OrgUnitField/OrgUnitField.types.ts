export type OrgUnit = {
    id: string;
    name: string;
    path: string;
};

export type OrgUnitFieldProps = {
    selected: { id: string; path: string[] };
    onSelectClick: (orgUnit: { id: string; path: string }) => void;
};

export type OrgUnitTreeProps = {
    roots: Array<{ id: string; path: string }>;
    classes: {
        orgunitTree: string;
    };
    onSelectClick: (orgUnit: { id: string; path: string }) => void;
    selected?: { path: string; id: string };
    treeKey: string;
};
