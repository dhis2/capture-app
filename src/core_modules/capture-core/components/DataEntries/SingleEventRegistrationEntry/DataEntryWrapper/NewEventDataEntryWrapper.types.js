// @flow

export type PlainProps = {|
    ...CssClasses,
    ...PlainProps,
|}

export type Props = {|
    dataEntryHasChanges: boolean,
    formHorizontal: ?boolean,
    onFormLayoutDirectionChange: (formHorizontal: boolean) => void,
|}

export type StateProps = {|
    dataEntryHasChanges: boolean,
    formHorizontal: ?boolean,
|}

export type ContainerProps = {|

|};

export type MapStateToProps = (ReduxState, ContainerProps) => StateProps;
