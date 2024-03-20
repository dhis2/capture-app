// @flow

export type Props = {|
    trackedEntityTypeName: string,
    canCascadeDeleteTei: boolean,
    canWriteData: boolean,
    setActionsIsOpen: (toogle: boolean) => void,
    setDeleteModalIsOpen: (toogle: boolean) => void,
|};
