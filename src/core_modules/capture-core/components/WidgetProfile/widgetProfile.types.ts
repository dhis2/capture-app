export type Props = {
    teiId: string;
    programId: string;
    orgUnitId: string;
    readOnlyMode?: boolean;
    onUpdateTeiAttributeValues?: (attributes: Array<{ [key: string]: string }>, teiDisplayName: string) => void;
    onDeleteSuccess?: () => void;
};

export type PlainProps = Props & {
    classes: {
        header: string;
        container: string;
        actions: string;
    };
};
