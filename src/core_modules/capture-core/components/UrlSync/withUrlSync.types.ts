

export type Props = {
    urlPage: string;
    statePage: string;
    urlParams?: string | null;
    stateParams: Record<string, unknown> | null;
    onUpdate: (selections: Record<string, unknown>) => void;
    onNoUpdateRequired?: () => void;
    history: {
        location: {
            search: string;
        };
    };
};

export type SyncSpecification = {
    urlParameterName: string;
};

export type SyncSpecificationGetter = (props: Props) => Array<SyncSpecification>;

export type UpdateDataContainer = {
    nextProps: Record<string, unknown>;
    prevProps: Record<string, unknown>;
    nextPage: string | null;
    prevPage: string | null;
};
