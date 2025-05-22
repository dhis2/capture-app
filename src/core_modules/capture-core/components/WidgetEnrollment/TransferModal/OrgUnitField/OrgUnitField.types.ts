type OrgUnit = {
    id: string;
    name: string;
    path: string;
};

type CssClasses = {
    [key: string]: string;
};

export type Props = {
    selectedOrgUnit?: OrgUnit;
    onSelect: (orgUnit: OrgUnit) => void;
} & CssClasses;
