type PassOnProps = {
    programId: string;
    orgUnitId?: string;
    mutationInProgress: boolean;
};

export type Props = PassOnProps & {
    isOnline: boolean;
    storeId: string;
};
