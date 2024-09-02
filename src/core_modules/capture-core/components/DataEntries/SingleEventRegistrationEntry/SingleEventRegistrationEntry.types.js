// @flow
export type StateProps = {|
    ready: boolean,
    showAddRelationship: boolean,
    eventAccess: {|
        read: boolean,
        write: boolean,
    |},
|}

export type ContainerProps = {|
    id: string,
    selectedScopeId: string,
|};

export type Props = {|
    ...ContainerProps,
    ...StateProps,
|};

export type DispatchProps = () => {||};

export type MapDispatchToProps = () => {||};

export type MapStateToProps = (ReduxState, ContainerProps) => StateProps;

