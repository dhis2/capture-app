// @flow

type SharedProps = {|
    onClearSelection: () => void,
    selectedRowsCount: number,
    children: React$Node,
|}

export type ContainerProps = {|
    ...SharedProps,
|}

export type ComponentProps = {|
    ...SharedProps,
|}
