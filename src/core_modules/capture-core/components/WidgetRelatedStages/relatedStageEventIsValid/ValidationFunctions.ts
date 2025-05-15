import i18n from '@dhis2/d2-i18n';
import { isValidDate } from '../../../utils/validation/validators/form';
import { relatedStageActions } from '../constants';

type Props = {
    scheduledAt: string | undefined;
    scheduledAtFormatError: { error: string | null; errorCode: string | null } | undefined;
    orgUnit: Record<string, any> | undefined;
    linkedEventId: string | undefined;
    linkMode: keyof typeof relatedStageActions | undefined;
    setErrorMessages: (messages: Record<string, any>) => void;
};

export const isScheduledDateValid = (scheduledDate: string | undefined, scheduledAtFormatError: { error: string | null; errorCode: string | null } | undefined) => {
    if (!scheduledDate) {
        return { valid: false, errorMessage: i18n.t('Please enter a date') as string };
    }

    if (scheduledAtFormatError?.error) {
        return { valid: false, errorMessage: scheduledAtFormatError.error };
    }

    if (!isValidDate(scheduledDate)) {
        return { valid: false, errorMessage: i18n.t('Please provide a valid date') as string };
    }

    return { valid: true, errorMessage: null };
};

export const isOrgUnitValid = (orgUnit: Record<string, any> | undefined) => {
    if (!orgUnit) {
        return { valid: false, errorMessage: i18n.t('Please select an organisation unit') as string };
    }
    return { valid: true, errorMessage: null };
};

export const isLinkedEventIdValid = (linkedEventId: string | undefined) => {
    if (!linkedEventId) {
        return { valid: false, errorMessage: i18n.t('Please select an event') as string };
    }
    return { valid: true, errorMessage: null };
};

export const scheduleInOrgUnit = (props: Props | undefined) => {
    if (!props) {
        return false;
    }

    const { scheduledAt, scheduledAtFormatError, orgUnit, setErrorMessages } = props;

    const scheduledDateValidation = isScheduledDateValid(scheduledAt, scheduledAtFormatError);
    const orgUnitValidation = isOrgUnitValid(orgUnit);

    const errorMessages = {
        scheduledAt: scheduledDateValidation.errorMessage,
        orgUnit: orgUnitValidation.errorMessage,
    };

    setErrorMessages(errorMessages);

    return scheduledDateValidation.valid && orgUnitValidation.valid;
};

export const enterData = (props: Props | undefined) => {
    if (!props) {
        return false;
    }

    const { orgUnit, setErrorMessages } = props;

    const orgUnitValidation = isOrgUnitValid(orgUnit);

    const errorMessages = {
        orgUnit: orgUnitValidation.errorMessage,
    };

    setErrorMessages(errorMessages);

    return orgUnitValidation.valid;
};

export const linkToExistingResponse = (props: Props | undefined) => {
    if (!props) {
        return false;
    }

    const { linkedEventId, setErrorMessages } = props;

    const linkedEventIdValidation = isLinkedEventIdValid(linkedEventId);

    const errorMessages = {
        linkedEventId: linkedEventIdValidation.errorMessage,
    };

    setErrorMessages(errorMessages);

    return linkedEventIdValidation.valid;
};

export const ValidationFunctionsByLinkMode: { [key: string]: (props: Props | undefined) => boolean } = {
    [relatedStageActions.SCHEDULE_IN_ORG]: props => scheduleInOrgUnit(props),
    [relatedStageActions.ENTER_DATA]: props => enterData(props),
    [relatedStageActions.LINK_EXISTING_RESPONSE]: props => linkToExistingResponse(props),
};
