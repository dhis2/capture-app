type PassOnProps = {
    mutationInProgress: boolean;
};

export type Props = PassOnProps & {
    isOnline: boolean;
    storeId: string;
};
