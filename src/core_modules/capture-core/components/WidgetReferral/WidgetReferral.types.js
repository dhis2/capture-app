// @flow
import { actions as ReferralModes } from './constants';

export type Props = {|
    programId: string,
    programStageId: string,
    currentStageLabel: string,
|}
export type ReferralDataValueStates = {|
    referralMode: typeof ReferralModes.REFER_ORG,
    scheduledAt: string,
    orgUnit: ?{
        path: string,
        id: string,
        name: string,
    },
|}
