// @flow
import React from 'react';
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

type Props = {
    referralDataValues: Object,
    onSelectOrgUnit: (orgUnit: Object) => void,
    onDeselectOrgUnit: () => void,
    saveAttempted: boolean,
    errorMessages: Object,
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
}: Props) => (
    <OrgUnitFieldForForm
        label={i18n.t('Organisation unit', { interpolation: { escapeValue: false } })}
        value={referralDataValues.orgUnit}
        required
        onSelectClick={onSelectOrgUnit}
        onBlur={onDeselectOrgUnit}
        styles={baseInputStyles}
        errorMessage={saveAttempted && errorMessages?.orgUnit}
    />
);
