// @flow
import type { ReferralDataValueStates } from '../validated.types';

export type ReferralIsValidProps = {|
    scheduledAt: string,
    orgUnit: Object,
    setErrorMessages: (message: Object) => void,
|}

type ReferralType = {|
    id: string,
    fromConstraint: {|
        programStage: {
            id: string,
        },
    |},
    toConstraint: {
        programStage: {
            id: string,
        },
    }
|}

export type ConvertedReferralEventProps = {|
    referralDataValues: ReferralDataValueStates,
    programId: string,
    teiId: string,
    currentProgramStageId: string,
    currentEventId: string,
    enrollmentId: string,
    referralType: ReferralType,
|}
