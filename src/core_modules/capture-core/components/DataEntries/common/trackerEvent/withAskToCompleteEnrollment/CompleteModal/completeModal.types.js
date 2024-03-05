// @flow

export type Props = {|
    programId: string,
    eventId?: ?string,
    enrollment: ApiEnrollment,
    events: Array<ApiEnrollmentEvent>,
    hasActiveEvents: boolean,
    onCompleteEnrollment: (enrollment: Object) => void,
    programStageName: string,
    onCancel: () => void,
|};

export type PlainProps = {|
    programStageName: string,
    onCancel: () => void,
    onCompleteEnrollment: () => void,
|};

export type PlainPropsWithEvents = {|
    ...PlainProps,
    programStagesWithActiveEvents: { [programId: string]: { name: string, count: number } },
    programStagesWithoutAccess: { [programId: string]: { name: string, count: number } },
    onCompleteEnrollmentAndEvents: () => void,
|};
