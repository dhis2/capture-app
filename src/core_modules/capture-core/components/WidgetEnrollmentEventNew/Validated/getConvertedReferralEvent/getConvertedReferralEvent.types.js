// @flow
import type { ReferralDataValueStates } from '../../../WidgetReferral';
import { actions as ReferralModes } from '../../../WidgetReferral/constants';
import type { RequestEvent } from '../validated.types';

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
    referralMode: $Keys<typeof ReferralModes>,
    referralDataValues: ReferralDataValueStates,
    programId: string,
    teiId: string,
    currentProgramStageId: string,
    enrollmentId: string,
    referralType: ReferralType,
    clientRequestEvent: RequestEvent,
|}
