export type Props = {
    showAddRelationship: boolean;
    eventAccess: {
        read: boolean;
        write: boolean;
    };
};

export type StateProps = {
    ready: boolean;
} & Props;

export type ContainerProps = {
    id: string;
    selectedScopeId: string;
    orgUnitId: string;
};

export type DispatchProps = {
    onCancel: () => void;
};

export type MapStateToProps = (ReduxState: any, props: ContainerProps) => StateProps;
