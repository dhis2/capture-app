export type Props = {
    programId: string;
    selectedOrgUnitId: string;
};

export type Settings = {
    hideAOC?: (props: any) => boolean;
};
