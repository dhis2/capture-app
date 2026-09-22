import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { isValidOrgUnit } from 'capture-core-utils/validators/form';
import labelTypeClasses from './dataEntryFieldLabels.module.css';
import {
    SingleOrgUnitSelectField,
    withDefaultFieldContainer,
    withDisplayMessages,
    withInternalChangeHandler,
    withLabel,
} from '../../FormFields/New';
import type { PlainProps as Props } from './ScheduleOrgUnit.types';
import type { OrgUnitValue } from '../widgetEventSchedule.types';

const baseInputStyles = {
    inputContainerStyle: { flexBasis: 150 },
    labelContainerStyle: { flexBasis: 200 },
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

export const ScheduleOrgUnit = ({
    onSelectOrgUnit,
    onDeselectOrgUnit,
    orgUnit,
    saveAttempted,
}: Props) => {
    const [touched, setTouched] = useState(false);

    const handleSelect = (event: OrgUnitValue) => {
        setTouched(true);
        onSelectOrgUnit(event);
    };

    const handleDeselect = () => {
        setTouched(true);
        onDeselectOrgUnit();
    };

    const shouldShowError = !isValidOrgUnit(orgUnit) && (saveAttempted || touched);
    const errorMessage = shouldShowError ? i18n.t('Please provide a valid organisation unit') : undefined;

    return (
        <OrgUnitFieldForForm
            label={i18n.t('Organisation unit')}
            value={orgUnit}
            required
            onSelectClick={handleSelect}
            onBlur={handleDeselect}
            styles={baseInputStyles}
            errorMessage={errorMessage}
        />
    );
};
