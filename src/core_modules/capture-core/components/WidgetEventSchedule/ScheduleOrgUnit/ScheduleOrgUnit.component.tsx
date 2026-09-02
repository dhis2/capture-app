import React, { useState } from 'react';
import { isValidOrgUnit } from 'capture-core-utils/validators/form';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import labelTypeClasses from './dataEntryFieldLabels.module.css';
import { baseInputStyles } from './commonProps';
import {
    SingleOrgUnitSelectField,
    withDefaultFieldContainer,
    withDisplayMessages,
    withInternalChangeHandler,
    withLabel,
} from '../../FormFields/New';
import { useTermLabel } from '../../../metaData';
import { tCustomTerm } from '../../../utils/tCustomTerm';

type OrgUnitValue = {
    checked: boolean;
    id: string;
    children: number;
    name: string;
    displayName: string;
    path: string;
    selected: string[];
}

type Props = {
    onSelectOrgUnit: (orgUnit: OrgUnitValue) => void;
    onDeselectOrgUnit: () => void;
    orgUnit?: OrgUnitValue | null;
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
    const orgUnitLabel = useTermLabel('orgUnit');

    const handleSelect = (event: any) => {
        setTouched(true);
        onSelectOrgUnit(event);
    };

    const handleDeselect = () => {
        setTouched(true);
        onDeselectOrgUnit();
    };

    const shouldShowError = (!isValidOrgUnit(orgUnit) && touched);
    const errorMessages = tCustomTerm('Please provide a valid {{orgUnitLabel}}', { orgUnitLabel });

    return (
        <OrgUnitFieldForForm
            label={capitalizeFirstLetter(orgUnitLabel)}
            value={orgUnit}
            required
            onSelectClick={handleSelect}
            onBlur={handleDeselect}
            styles={baseInputStyles}
            errorMessage={shouldShowError ? errorMessages : undefined}
        />
    );
};
