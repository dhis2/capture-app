// @flow

export type Props = {|
    trackedEntity: { trackedEntity: string },
    trackedEntityTypeName: string,
    setOpenModal: (toogle: boolean) => void,
    onDeleteSuccess?: () => void,
|};
