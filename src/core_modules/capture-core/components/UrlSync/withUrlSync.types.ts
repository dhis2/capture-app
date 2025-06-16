

export type Props = {
    urlPage: string;
    statePage: string;
    urlParams?: string | null;
    stateParams: Record<string, any> | null;
    onUpdate: (selections: Record<string, any>) => void;
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
    nextProps: Record<string, any>;
    prevProps: Record<string, any>;
    nextPage: string | null;
    prevPage: string | null;
};
