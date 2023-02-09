// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import classNames from 'classnames';
import i18n from '@dhis2/d2-i18n';
import { colors, spacers, spacersNum } from '@dhis2/ui';
import { convertStringToDateFormat } from '../../../utils/converters/date';
import { DateField, SingleOrgUnitSelectField } from '../../FormFields/New';
import type { ReferralDataValueStates } from '../../WidgetEnrollmentEventNew/Validated/validated.types';

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
    referralDataValues: ReferralDataValueStates,
    setReferralDataValues: (() => Object) => void,
    ...CssClasses,
}

export const ReferToOrgUnitContainerPlain = ({ referralDataValues, setReferralDataValues, classes }: Props) => {
    const onBlurDateField = (e) => {
        setReferralDataValues(prevValues => ({
            ...prevValues,
            scheduledAt: convertStringToDateFormat(e),
        }));
    };

    const onSelectOrgUnit = (e) => {
        setReferralDataValues(prevValues => ({
            ...prevValues,
            orgUnit: {
                id: e.id,
                name: e.displayName,
            },
        }));
    };

    const onDeselectOrgUnit = () => {
        setReferralDataValues(prevValues => ({
            ...prevValues,
            orgUnit: null,
        }));
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.fieldWrapper}>
                <div className={classes.fieldLabel}>
                    {i18n.t('Schedule date / Due date', { interpolation: { escapeValue: false } })}
                </div>
                <div className={classes.fieldContent}>
                    <DateField
                        value={referralDataValues.scheduledAt ? convertStringToDateFormat(referralDataValues.scheduledAt) : ''}
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
                        value={referralDataValues.orgUnit}
                        onSelectClick={onSelectOrgUnit}
                        onBlur={onDeselectOrgUnit}
                    />
                </div>
            </div>
        </div>
    );
};

export const ReferToOrgUnit: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(ReferToOrgUnitContainerPlain);
