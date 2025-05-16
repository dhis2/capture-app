import React, { useState, type ReactNode } from 'react';
import i18n from '@dhis2/d2-i18n';
import { isValidOrgUnit } from 'capture-core-utils/validators/form';
import labelTypeClasses from './dataEntryFieldLabels.module.css';
import { baseInputStyles } from './commonProps';
import {
    SingleOrgUnitSelectField,
    withDefaultFieldContainer,
    withDisplayMessages,
    withInternalChangeHandler,
    withLabel,
} from '../../FormFields/New';

export type OrgUnitValue = {
    checked?: boolean;
    id: string;
    children?: number;
    name?: string;
    displayName?: string;
    path?: string;
    selected?: string[];
}

type Props = {
    onSelectOrgUnit: (orgUnit: OrgUnitValue) => void;
    onDeselectOrgUnit: () => void;
    orgUnit: Partial<OrgUnitValue>;
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

    const shouldShowError = (!isValidOrgUnit(orgUnit) && touched);
    const errorMessages = i18n.t('Please provide a valid organisation unit');

    return (
        <OrgUnitFieldForForm
            label={i18n.t('Organisation unit')}
            value={orgUnit}
            required
            onSelectClick={handleSelect}
            onBlur={handleDeselect}
            styles={baseInputStyles}
            errorMessage={shouldShowError && errorMessages}
        />
    );
};
