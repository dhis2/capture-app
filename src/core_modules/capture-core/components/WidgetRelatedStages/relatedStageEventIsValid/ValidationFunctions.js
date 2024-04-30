// @flow
import i18n from '@dhis2/d2-i18n';
import { systemSettingsStore } from '../../../metaDataMemoryStores';
import { isValidDate, isValidOrgUnit } from '../../../../capture-core-utils/validators/form';
import { actions as RelatedStageModes } from '../constants';

type Props = {
    scheduledAt: ?string,
    orgUnit: ?Object,
    linkedEventId: ?string,
    setErrorMessages: (messages: Object) => void,
};

export const isScheduledDateValid = (scheduledDate: string) => {
    const dateFormat = systemSettingsStore.get().dateFormat;
    return isValidDate(scheduledDate, dateFormat);
};

const scheduleInOrgUnit = (props) => {
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
    [RelatedStageModes.SCHEDULE_IN_ORG]: props => scheduleInOrgUnit(props),
    [RelatedStageModes.ENTER_DATA]: () => true,
    [RelatedStageModes.LINK_EXISTING_RESPONSE]: props => linkToExistingResponse(props),
};

