// @flow

export type Props = {|
    enrollment: Object,
    events: Array<{ status: string, event: string, programStage: string }>,
    programStages: Array<{ name: string, id: string, access: { data: { write: boolean } } }>,
    setOpenCompleteModal: (toggle: boolean) => void,
    onUpdateStatus: (enrollment: Object, redirect?: boolean) => void,
|};

export type PlainProps = {|
    programStagesWithActiveEvents: { [programId: string]: { name: string, count: number } },
    programStagesWithoutAccess: { [programId: string]: { name: string, count: number } },
    setOpenCompleteModal: (toggle: boolean) => void,
    onCompleteEnrollment: () => void,
    onCompleteEnrollmentAndEvents: () => void,
|};
