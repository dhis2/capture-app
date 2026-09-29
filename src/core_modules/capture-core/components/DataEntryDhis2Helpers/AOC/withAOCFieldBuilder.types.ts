export type Props = {
    programId: string;
    orgUnitId: string;
};

export type Settings = {
    hideAOC?: (props: any) => boolean;
};
