// @flow
import i18n from '@dhis2/d2-i18n';
import { systemSettingsStore } from '../../../metaDataMemoryStores';
import { isValidDate, isValidOrgUnit } from '../../../../capture-core-utils/validators/form';
import { actions as ReferralModes } from '../constants';

type Props = {
    scheduledAt: ?string,
    orgUnit: ?Object,
    setErrorMessages: (messages: Object) => void,
};

export const isScheduledDateValid = (scheduledDate: string) => {
    const dateFormat = systemSettingsStore.get().dateFormat;
    return isValidDate(scheduledDate, dateFormat);
};

const referToOrgUnit = (props) => {
    const { scheduledAt, orgUnit, setErrorMessages } = props ?? {};
    const scheduledAtIsValid = !!scheduledAt && isScheduledDateValid(scheduledAt);
    const orgUnitIsValid = isValidOrgUnit(orgUnit);

    if (!scheduledAtIsValid) {
        setErrorMessages({
            scheduledAt: i18n.t('Please provide a valid date'),
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


export const ValidationFunctionsByReferralMode: { [key: string]: (props: ?Props) => boolean } = {
    [ReferralModes.REFER_ORG]: props => referToOrgUnit(props),
    [ReferralModes.ENTER_DATA]: () => true,
    [ReferralModes.LINK_EXISTING_RESPONSE]: () => true,
    [ReferralModes.DO_NOT_LINK_RESPONSE]: () => true,
};

