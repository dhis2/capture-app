// @flow

export type Props = {
    selectedRows: { [key: string]: boolean },
    programId: string,
    onClearSelection: () => void,
    onUpdateList: () => void,
}

export type ContainerProps = {
    ...Props,
    programStageId: ?string,
}
