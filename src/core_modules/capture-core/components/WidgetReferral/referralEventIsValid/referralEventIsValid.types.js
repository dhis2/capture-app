// @flow
import type { ErrorMessagesForReferral } from '../ReferralActions';

export type ReferralIsValidProps = {|
    scheduledAt: ?string,
    orgUnit: ?{
        id: string,
        name: string,
        path: string,
    },
    setErrorMessages: (message: ErrorMessagesForReferral) => void,
|}
