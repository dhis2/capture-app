// @flow
import log from 'loglevel';
import type { ReferralIsValidProps } from './referralEventIsValid.types';
import { errorCreator } from '../../../../capture-core-utils';
import { ValidationFunctionsByReferralMode } from './ValidationFunctions';


export const referralWidgetIsValid = ({
    referralMode,
    scheduledAt,
    orgUnit,
    linkedEventId,
    setErrorMessages,
}: ReferralIsValidProps): boolean => {
    const validationFunction = ValidationFunctionsByReferralMode[referralMode];

    if (!validationFunction) {
        log.error(errorCreator('No validation function found for referral mode'));
        return false;
    }

    return validationFunction({
        scheduledAt,
        orgUnit,
        linkedEventId,
        setErrorMessages,
    });
};
