// @flow
import React, { useState, useCallback, type ComponentType } from 'react';
import {
    Button,
    ButtonStrip,
    CalendarInput,
    InputField,
    IconCalendar16,
    IconEdit16,
    colors,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { DateField } from 'capture-core/components/FormFields/New';
import { convertValue as convertValueClientToView } from '../../../converters/clientToView';
import { convertValue as convertFormToClient } from '../../../converters/formToClient';
import { dataElementTypes } from '../../../metaData';

type Props = {
    enrollmentDateLabel: string,
    enrollmentDate: string,
    editEnabled: boolean,
    onSave: (?string) => void,
    ...CssClasses,
}

export const EnrollmentDateComponent = ({
    enrollmentDateLabel,
    enrollmentDate,
    editEnabled,
    onSave,
    classes,
}: Props) => {
    const [editMode, setEditMode] = useState(false);
    const [selectedDate, setSelectedDate] = useState();
    const dateChangeHandler = useCallback(({ value }) => {
        setSelectedDate(value);
    }, [setSelectedDate]);
    const displayEnrollmentDate = String(convertValueClientToView(enrollmentDate, dataElementTypes.DATE));

    const onOpenEdit = () => {
        setSelectedDate(displayEnrollmentDate);
        setEditMode(true);
    };
    const saveHandler = () => {
        if (selectedDate === displayEnrollmentDate) {
            setEditMode(false);
            return;
        }

        // [input validation]

        onSave(String(convertFormToClient(selectedDate, dataElementTypes.DATE)));
        setEditMode(false);
    }
    
    return editMode ? (
        <div className={classes.column} data-test="widget-enrollment-enrollment-date">
            <div className={classes.column}>
                {enrollmentDateLabel}
            </div>
            {/* <DateField
                value={displayEnrollmentDate}
                width="50%"
                calendarWidth={150}
                onSetFocus={() => {}}
                onFocus={() => {}}
                onRemoveFocus={() => {}}
                onBlur={(e) => { setSelectedDate(e) }}
            /> */}
            <div className={classes.column}>
                <InputField
                    dense
                    value={selectedDate}
                    onChange={dateChangeHandler}
                />
            </div>
            <div className={classes.column}>
            <ButtonStrip>
                <Button
                    small
                    onClick={saveHandler}
                >
                    {i18n.t('Save')}
                </Button>
                <Button
                    secondary
                    small
                    onClick={() => setEditMode(false)}
                >
                    {i18n.t('Cancel')}
                </Button>
            </ButtonStrip>
            </div>
        </div>
    ) : (
        <div className={classes.row} data-test="widget-enrollment-enrollment-date">
            <span className={classes.icon} data-test="widget-enrollment-icon-calendar">
                <IconCalendar16 color={colors.grey600} />
            </span>
            {enrollmentDateLabel}{' '}
            {displayEnrollmentDate}
            {editEnabled &&
                <span className={classes.icon} data-test="widget-enrollment-icon-edit-enrollment-date">
                    <Button
                        small
                        icon={<IconEdit16 color={colors.grey600} />}
                        onClick={onOpenEdit}
                    />
                </span>
            }
        </div>
    );
};
