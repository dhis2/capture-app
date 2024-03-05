// @flow

export type Props = {|
    enrollment: Object,
    events: Array<{ status: string, event: string, programStage: string }>,
    onUpdate: (arg: Object) => void,
    setOpenCompleteModal: (toggle: boolean) => void,
|};
