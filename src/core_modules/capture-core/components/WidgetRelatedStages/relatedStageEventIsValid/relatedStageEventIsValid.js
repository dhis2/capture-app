// @flow
import log from 'loglevel';
import type { RelatedStageIsValidProps } from './relatedStageEventIsValid.types';
import { errorCreator } from '../../../../capture-core-utils';
import { ValidationFunctionsByLinkMode } from './ValidationFunctions';


export const relatedStageWidgetIsValid = ({
    linkMode,
    scheduledAt,
    orgUnit,
    linkedEventId,
    setErrorMessages,
}: RelatedStageIsValidProps): boolean => {
    if (!linkMode) {
        return true;
    }

    const validationFunction = ValidationFunctionsByLinkMode[linkMode];

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
