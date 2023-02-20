// @flow
import type { ReferralDataValueStates } from '../validated.types';
import type { ErrorMessagesForReferral } from '../../../WidgetReferral/ReferralActions/ReferralActions.types';

export type ReferralIsValidProps = {|
    scheduledAt: ?string,
    orgUnit: ?{
        id: string,
        name: string,
        path: string,
    },
    setErrorMessages: (message: ErrorMessagesForReferral) => void,
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
