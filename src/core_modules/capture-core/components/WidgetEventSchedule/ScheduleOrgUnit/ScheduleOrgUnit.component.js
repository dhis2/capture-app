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
import labelTypeClasses from './dataEntryFieldLabels.module.css';
import { baseInputStyles } from './commonProps';

type OrgUnitValue = {|
    checked: boolean,
    id: string,
    children: number,
    displayName: string,
    path: string,
    selected: string[],
|}

type Props = {
    onSelectOrgUnit: (orgUnit: OrgUnitValue) => void,
    onDeselectOrgUnit: () => void,
    orgUnit: OrgUnitValue,
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
    const handleSelect = (event) => {
        onSelectOrgUnit(event);
    };

    const handleDeselect = () => {
        onDeselectOrgUnit();
    };

    return (
        <OrgUnitFieldForForm
            label={i18n.t('Organisation unit')}
            value={orgUnit}
            required
            onSelectClick={handleSelect}
            onBlur={handleDeselect}
            styles={baseInputStyles}
        />
    );
};
