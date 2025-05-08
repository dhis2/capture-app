// @flow
import i18n from '@dhis2/d2-i18n';
import { isValidOrgUnit, isValidPeriod } from '../../../../capture-core-utils/validators/form';
import { isValidDate } from '../../../utils/validation/validators/form';
import { relatedStageActions } from '../constants';

type Props = {
    scheduledAt: ?string,
    scheduledAtFormatError: ?{ error: ?string, errorCode: ?string },
    orgUnit: ?Object,
    linkedEventId: ?string,
    setErrorMessages: (messages: Object) => void,
    programExpiryPeriodType?: string,
    programExpiryDays?: number,
    canEditExpiredPeriod?: boolean,
};

export const isScheduledDateValid = (
    scheduledDate: ?string,
    scheduledAtFormatError: ?{ error: ?string, errorCode: ?string },
    programExpiryPeriodType?: string,
    programExpiryDays?: number,
    canEditExpiredPeriod?: boolean,
) => {
    const dateValidation = isValidDate(scheduledDate, scheduledAtFormatError);

    if (!scheduledDate) {
        return { valid: false, validationText: i18n.t('Please enter a dateee') };
    }

    if (!dateValidation.valid) {
        return {
            valid: false,
            validationText: dateValidation.errorMessage || i18n.t('Please provide a valid date'),
        };
    }
    if (!programExpiryPeriodType || !programExpiryDays || canEditExpiredPeriod) {
        return {
            valid: false,
            validationText: '',
        };
    }

    const { isValid: validPeriod, firstValidDate } = isValidPeriod(scheduledDate, {
        programExpiryPeriodType,
        programExpiryDays,
    });

    if (!validPeriod) {
        return {
            valid: false,
            validationText: i18n.t('The date entered belongs to an expired period. Enter a date after {{firstValidDate}}', {
                firstValidDate,
                interpolation: { escapeValue: false },
            }),
        };
    }
    return {
        valid: true,
        validationText: '',
    };
};

const scheduleInOrgUnit = (props) => {
    const {
        scheduledAt,
        scheduledAtFormatError,
        orgUnit,
        setErrorMessages,
        programExpiryPeriodType,
        programExpiryDays,
        canEditExpiredPeriod,
    } = props ?? {};
    const { valid: scheduledAtIsValid, validationText } = isScheduledDateValid(
        scheduledAt,
        scheduledAtFormatError,
        programExpiryPeriodType,
        programExpiryDays,
        canEditExpiredPeriod,
    );
    const orgUnitIsValid = isValidOrgUnit(orgUnit);

    if (!scheduledAtIsValid) {
        setErrorMessages({
            scheduledAt: validationText,
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

const enterData = (props) => {
    const { orgUnit, setErrorMessages } = props ?? {};
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

const linkToExistingResponse = (props) => {
    const { linkedEventId, setErrorMessages } = props ?? {};
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


export const ValidationFunctionsByLinkMode: { [key: string]: (props: ?Props) => boolean } = {
    [relatedStageActions.SCHEDULE_IN_ORG]: props => scheduleInOrgUnit(props),
    [relatedStageActions.ENTER_DATA]: props => enterData(props),
    [relatedStageActions.LINK_EXISTING_RESPONSE]: props => linkToExistingResponse(props),
};

