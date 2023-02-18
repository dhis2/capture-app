// @flow
import i18n from '@dhis2/d2-i18n';
import { systemSettingsStore } from '../../../../metaDataMemoryStores';
import { isValidDate, isValidOrgUnit } from '../../../../../capture-core-utils/validators/form';
import { generateUID } from '../../../../utils/uid/generateUID';
import type { ConvertedReferralEventProps, ReferralIsValidProps } from './getConvertedReferralEvent.types';

export const isScheduledDateValid = (scheduledDate: string) => {
    const dateFormat = systemSettingsStore.get().dateFormat;
    return isValidDate(scheduledDate, dateFormat);
};

export const referralWidgetIsValid = ({ scheduledAt, orgUnit, setErrorMessages }: ReferralIsValidProps): boolean => {
    const scheduledAtIsValid = isScheduledDateValid(scheduledAt);
    const orgUnitIsValid = isValidOrgUnit(orgUnit);

    if (!scheduledAtIsValid) {
        setErrorMessages({
            scheduledAt: i18n.t('Please provide a valid date'),
        });
    }

    if (!orgUnitIsValid) {
        setErrorMessages({
            orgUnit: i18n.t('Please provide a valid organisation unit'),
        });
    }

    return scheduledAtIsValid && orgUnitIsValid;
};

export const getConvertedReferralEvent = ({
    referralDataValues,
    programId,
    teiId,
    currentProgramStageId,
    currentEventId,
    enrollmentId,
    referralType,
}: ConvertedReferralEventProps) => {
    const { scheduledAt: referralScheduledAt, orgUnit: referralOrgUnit } = referralDataValues;

    const requestEventIsFromConstraint = referralType.fromConstraint.programStage.id === currentProgramStageId;

    const referralEvent = {
        event: generateUID(),
        program: programId,
        programStage: requestEventIsFromConstraint ?
            referralType.toConstraint.programStage.id
            : referralType.fromConstraint.programStage.id,
        trackedEntity: teiId,
        enrollment: enrollmentId,
        scheduledAt: referralScheduledAt,
        orgUnit: referralOrgUnit?.id,
        dataValues: [],
        status: 'SCHEDULE',
    };

    const relationship = {
        relationshipType: referralType.id,
        from: {
            event: {
                event: requestEventIsFromConstraint ? currentEventId : referralEvent.programStage,
            },
        },
        to: {
            event: {
                event: requestEventIsFromConstraint ? referralEvent.event : currentEventId,
            },
        },
    };

    return {
        referralEvent,
        relationship,
    };
};
