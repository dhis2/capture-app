// @flow
export type Props = {|
    showAddRelationship: boolean,
    eventAccess: {|
        read: boolean,
        write: boolean,
    |},
|};

export type StateProps = {|
    ready: boolean,
    ...Props,
|}

export type ContainerProps = {|
    id: string,
|};

export type MapStateToProps = (ReduxState, ContainerProps) => StateProps;
