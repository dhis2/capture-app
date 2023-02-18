// @flow
import React from 'react';
import type { ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { colors, spacers, spacersNum } from '@dhis2/ui';
import { convertStringToDateFormat } from '../../../utils/converters/date';
import type { ReferralDataValueStates } from '../../WidgetEnrollmentEventNew/Validated/validated.types';
import { DateFieldForReferral, OrgUnitSelectorForReferral } from '../FormComponents';
import {
    isScheduledDateValid,
} from '../../WidgetEnrollmentEventNew/Validated/getConvertedReferralEvent/getConvertedReferralEvent';
import { isValidOrgUnit } from '../../../../capture-core-utils/validators/form';

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
    errorMessages: Object,
    scheduledLabel: string,
    addErrorMessage: (Object) => void,
    saveAttempted: boolean,
    ...CssClasses,
}

export const ReferToOrgUnitContainerPlain = ({
    referralDataValues,
    setReferralDataValues,
    saveAttempted,
    errorMessages,
    scheduledLabel,
    addErrorMessage,
    classes,
}: Props) => {
    const onBlurDateField = (e) => {
        if (isScheduledDateValid(e)) {
            addErrorMessage({ scheduledAt: null });
        }
        setReferralDataValues(prevValues => ({
            ...prevValues,
            scheduledAt: convertStringToDateFormat(e),
        }));
    };

    const onSelectOrgUnit = (e) => {
        const orgUnit = {
            id: e.id,
            name: e.displayName,
            path: e.path,
        };

        if (isValidOrgUnit(orgUnit)) {
            addErrorMessage({ orgUnit: null });
        }
        setReferralDataValues(prevValues => ({
            ...prevValues,
            orgUnit,
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
            <div>
                <DateFieldForReferral
                    scheduledLabel={scheduledLabel}
                    errorMessages={errorMessages}
                    saveAttempted={saveAttempted}
                    onBlurDateField={onBlurDateField}
                    referralDataValues={referralDataValues}
                />
            </div>

            <div>
                <OrgUnitSelectorForReferral
                    referralDataValues={referralDataValues}
                    onSelectOrgUnit={onSelectOrgUnit}
                    onDeselectOrgUnit={onDeselectOrgUnit}
                    errorMessages={errorMessages}
                    saveAttempted={saveAttempted}
                />
            </div>
        </div>
    );
};

export const ReferToOrgUnit: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(ReferToOrgUnitContainerPlain);
