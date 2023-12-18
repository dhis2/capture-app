// @flow
import type { ErrorMessagesForReferral } from '../ReferralActions';
import { actions as ReferralModes } from '../constants';

export type ReferralIsValidProps = {|
    referralMode: $Keys<typeof ReferralModes>,
    scheduledAt: ?string,
    orgUnit: ?{
        id: string,
        name: string,
        path: string,
    },
    linkedEventId: ?string,
    setErrorMessages: (message: ErrorMessagesForReferral) => void,
|}
