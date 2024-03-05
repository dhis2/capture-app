// @flow

type OrgUnit = {
    id: string,
    name: string,
    path: string,
}

export type Props = {|
    selectedOrgUnit: ?OrgUnit,
    onSelect: (orgUnit: OrgUnit) => void,
    ...CssClasses,
|}
