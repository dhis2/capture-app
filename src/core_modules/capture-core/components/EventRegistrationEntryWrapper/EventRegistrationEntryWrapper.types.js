// @flow
export type Props = {|
    classes: Object,
    selectedScopeId: string,
    dataEntryId: string,
    orgUnitId: string,
    eventAccess?: {|
        read: boolean,
        write: boolean,
    |},
|};

export type ContainerProps = {|
    selectedScopeId: string,
    dataEntryId: string,
|};

export type StateProps = {|
    selectedScopeId: string,
    orgUnitId: string,
    dataEntryId: string,
    eventAccess: {|
        read: boolean,
        write: boolean,
    |},
    ready: boolean,
|};

export type ReduxState = Object;
export type MapStateToProps = (ReduxState, ContainerProps) => StateProps;
