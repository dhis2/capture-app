import i18n from '@dhis2/d2-i18n';
import { isValidOrgUnit } from '../../../../capture-core-utils/validators/form';
import { isValidDate } from '../../../utils/validation/validators/form';
import { relatedStageActions } from '../constants';

interface ScheduledAtFormatError {
    error?: string | null;
    errorCode?: string | null;
}

export interface Props {
    scheduledAt?: string | null;
    scheduledAtFormatError?: ScheduledAtFormatError | null;
    orgUnit?: Record<string, unknown> | null;
    linkedEventId?: string | null;
    setErrorMessages: (messages: Record<string, unknown>) => void;
}

export const isScheduledDateValid = (
    scheduledDate?: string | null,
    scheduledAtFormatError?: ScheduledAtFormatError | null,
): { valid: boolean; errorMessage: string } => {
    if (!scheduledDate) {
        return { valid: false, errorMessage: i18n.t('Please enter a date') };
    }
    const { valid, errorMessage } = isValidDate(scheduledDate, scheduledAtFormatError);
    return {
        valid,
        errorMessage,
    };
};

const scheduleInOrgUnit = (props?: Props): boolean => {
    const { scheduledAt, scheduledAtFormatError, orgUnit, setErrorMessages } = props ?? {} as Props;
    const { valid: scheduledAtIsValid, errorMessage } = isScheduledDateValid(scheduledAt, scheduledAtFormatError);
    const orgUnitIsValid = isValidOrgUnit(orgUnit);

    if (!scheduledAtIsValid) {
        setErrorMessages({
            scheduledAt: errorMessage,
        });
    } else {
        setErrorMessages({
            scheduledAt: null,
        });
    }

    if (!orgUnitIsValid) {
        setErrorMessages({
            orgUnit: i18n.t('Please provide a valid organisation unit'),
        });
    } else {
        setErrorMessages({
            orgUnit: null,
        });
    }

    return scheduledAtIsValid && orgUnitIsValid;
};

const enterData = (props?: Props): boolean => {
    const { orgUnit, setErrorMessages } = props ?? {} as Props;
    const orgUnitIsValid = isValidOrgUnit(orgUnit);

    if (!orgUnitIsValid) {
        setErrorMessages({
            orgUnit: i18n.t('Please provide a valid organisation unit'),
        });
    } else {
        setErrorMessages({
            orgUnit: null,
        });
    }

    return orgUnitIsValid;
};

const linkToExistingResponse = (props?: Props): boolean => {
    const { linkedEventId, setErrorMessages } = props ?? {} as Props;
    const linkedEventIdIsValid = !!linkedEventId;

    if (!linkedEventIdIsValid) {
        setErrorMessages({
            linkedEventId: i18n.t('Please select a valid event'),
        });
    } else {
        setErrorMessages({
            linkedEventId: null,
        });
    }

    return linkedEventIdIsValid;
};

export const ValidationFunctionsByLinkMode: Record<string, (props?: Props) => boolean> = {
    [relatedStageActions.SCHEDULE_IN_ORG]: (props?: Props) => scheduleInOrgUnit(props),
    [relatedStageActions.ENTER_DATA]: (props?: Props) => enterData(props),
    [relatedStageActions.LINK_EXISTING_RESPONSE]: (props?: Props) => linkToExistingResponse(props),
};
