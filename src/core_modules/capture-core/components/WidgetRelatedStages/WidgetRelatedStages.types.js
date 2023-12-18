// @flow
import { actions as LinkModes } from './constants';

export type Props = {|
    programId: string,
    enrollmentId: string,
    programStageId: string,
    currentStageLabel: string,
|}
export type RelatedStageDataValueStates = {|
    linkMode: typeof LinkModes.SCHEDULE_IN_ORG,
    scheduledAt: string,
    orgUnit: ?{
        path: string,
        id: string,
        name: string,
    },
    linkedEventId: ?string,
|}
