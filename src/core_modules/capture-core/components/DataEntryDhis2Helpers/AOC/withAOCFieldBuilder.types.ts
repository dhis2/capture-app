export type Props = {
    programId: string;
    orgUnitId: string;
    orgUnitIdFieldValue?: string;
};

export type Settings = {
    hideAOC?: (props: any) => boolean;
    getOrgUnitId?: (props: any) => string | undefined;
};
