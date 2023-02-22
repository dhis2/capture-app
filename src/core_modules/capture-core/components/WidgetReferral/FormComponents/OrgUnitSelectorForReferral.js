// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    SingleOrgUnitSelectField,
    withDefaultFieldContainer,
    withDisplayMessages,
    withInternalChangeHandler,
    withLabel,
} from '../../FormFields/New';
import labelTypeClasses from '../../WidgetEnrollmentEventNew/DataEntry/dataEntryFieldLabels.module.css';
import { baseInputStyles } from './commonProps';
import type { ErrorMessagesForReferral } from '../ReferralActions';
import type { ReferralDataValueStates } from '../WidgetReferral.types';

type OrgUnitValue = {|
    checked: boolean,
    id: string,
    children: number,
    displayName: string,
    path: string,
    selected: string[],
|}

type Props = {
    referralDataValues: ReferralDataValueStates,
    onSelectOrgUnit: (orgUnit: OrgUnitValue) => void,
    onDeselectOrgUnit: () => void,
    saveAttempted: boolean,
    errorMessages: ErrorMessagesForReferral,
};

const OrgUnitFieldForForm = withDefaultFieldContainer()(
    withLabel({
        onGetCustomFieldLabeClass: () => labelTypeClasses.dateLabel,
    })(
        withDisplayMessages()(
            withInternalChangeHandler()(
                SingleOrgUnitSelectField,
            ),
        ),
    ),
);

export const OrgUnitSelectorForReferral = ({
    referralDataValues,
    onSelectOrgUnit,
    onDeselectOrgUnit,
    errorMessages,
    saveAttempted,
}: Props) => {
    const [touched, setTouched] = useState(false);

    const handleSelect = (event) => {
        setTouched(true);
        onSelectOrgUnit(event);
    };

    const handleDeselect = () => {
        setTouched(true);
        onDeselectOrgUnit();
    };

    const shouldShowError = (saveAttempted || touched);

    return (
        <OrgUnitFieldForForm
            label={i18n.t('Organisation unit', { interpolation: { escapeValue: false } })}
            value={referralDataValues.orgUnit}
            required
            onSelectClick={handleSelect}
            onBlur={handleDeselect}
            styles={baseInputStyles}
            errorMessage={shouldShowError && errorMessages?.orgUnit}
        />
    );
};
