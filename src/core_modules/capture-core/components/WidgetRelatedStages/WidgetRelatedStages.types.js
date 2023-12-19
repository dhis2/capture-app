// @flow
import { actions as LinkModes } from './constants';

export type Props = {|
    programId: string,
    enrollmentId: string,
    programStageId: string,
    currentStageLabel: string,
|}
export type RelatedStageDataValueStates = {|
    linkMode: ?$Keys<typeof LinkModes>,
    scheduledAt: string,
    orgUnit: ?{
        path: string,
        id: string,
        name: string,
    },
    linkedEventId: ?string,
|}
