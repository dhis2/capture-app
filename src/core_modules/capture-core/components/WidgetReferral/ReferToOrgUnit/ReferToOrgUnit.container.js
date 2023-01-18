// @flow
import React, { useState } from 'react';
import type { ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import classNames from 'classnames';
import i18n from '@dhis2/d2-i18n';
import { colors, spacers, spacersNum } from '@dhis2/ui';
import { convertStringToDateFormat } from '../../../utils/converters/date';
import { DateField, SingleOrgUnitSelectField } from '../../FormFields/New';

const styles = {
    wrapper: {
        padding: `${spacers.dp16} 0`,
        maxWidth: '55.75rem',
    },
    fieldWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'start',
        justifyContent: 'space-between',
        padding: `${spacers.dp8}  ${spacers.dp16}`,
    },
    fieldLabel: {
        color: colors.grey900,
        paddingTop: spacersNum.dp12,
        paddingRight: spacersNum.dp16,
        flexBasis: '200px',
    },
    fieldContent: {
        flexBasis: '150px',
        flexGrow: 1,
    },
    alternateColor: {
        backgroundColor: colors.grey100,
    },
};

type Props = {
    ...CssClasses,
}

export const ReferToOrgUnitContainerPlain = ({ classes }: Props) => {
    const [scheduleDate, setScheduleDate] = useState(null);
    const [orgUnit, setOrgUnit] = useState(null);

    const onBlurDateField = (e) => { setScheduleDate(convertStringToDateFormat(e)); };

    const onSelectOrgUnit = (e) => {
        setOrgUnit({
            id: e.id,
            name: e.displayName,
        });
    };

    const onDeselctOrgUnit = () => {
        setOrgUnit(null);
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.fieldWrapper}>
                <div className={classes.fieldLabel}>
                    {i18n.t('Schedule date / Due date', { interpolation: { escapeValue: false } })}
                </div>
                <div className={classes.fieldContent}>
                    <DateField
                        value={scheduleDate ? convertStringToDateFormat(scheduleDate) : ''}
                        width="100%"
                        calendarWidth={350}
                        onSetFocus={() => {}}
                        onFocus={() => { }}
                        onRemoveFocus={() => { }}
                        onBlur={onBlurDateField}
                    />
                </div>
            </div>

            <div className={classNames(classes.fieldWrapper, classes.alternateColor)}>
                <div className={classes.fieldLabel}>
                    {i18n.t('Refer to organisation unit', { interpolation: { escapeValue: false } })}
                </div>

                <div className={classes.fieldContent}>
                    <SingleOrgUnitSelectField
                        value={orgUnit}
                        onSelectClick={onSelectOrgUnit}
                        onBlur={onDeselctOrgUnit}
                    />
                </div>
            </div>
        </div>
    );
};

export const ReferToOrgUnit: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(ReferToOrgUnitContainerPlain);
