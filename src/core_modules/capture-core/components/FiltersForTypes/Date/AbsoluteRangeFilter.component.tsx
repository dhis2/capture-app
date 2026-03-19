import React, { Component } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { cx } from '@emotion/css';
import i18n from '@dhis2/d2-i18n';
import { Temporal } from '@js-temporal/polyfill';
import { D2Date } from '../../FormFields/DateAndTime/D2Date/D2Date.component';
import { convertLocalToIsoCalendar } from '../../../utils/converters/date';
import type { DateValue } from './types';

function isFromAfterTo(valueFrom: string, valueTo: string): boolean {
    const from = convertLocalToIsoCalendar(valueFrom);
    const to = convertLocalToIsoCalendar(valueTo);
    const fromIso = Temporal.PlainDate.from(from.split('T')[0]);
    const toIso = Temporal.PlainDate.from(to.split('T')[0]);
    return Temporal.PlainDate.compare(fromIso, toIso) > 0;
}

export function getAbsoluteRangeErrors(
    fromValue: DateValue | undefined,
    toValue: DateValue | undefined,
    submitAttempted: boolean,
) {
    const fromValueString = fromValue?.value;
    const toValueString = toValue?.value;
    const isFromValueValid = fromValue?.isValid;
    const isToValueValid = toValue?.isValid;

    if (!fromValueString && !toValueString) {
        return {
            dateLogicError: submitAttempted ? i18n.t('Please specify a range') : null,
        };
    }

    const hasDateLogicError =
        fromValueString && toValueString && isFromValueValid && isToValueValid &&
        isFromAfterTo(fromValueString, toValueString);

    return {
        dateLogicError: hasDateLogicError
            ? i18n.t('Start date must be before the end date')
            : null,
    };
}

function isDateSideValid(side: DateValue | null | undefined): boolean {
    if (!side) return true;
    return Boolean(side.isValid);
}

export function isAbsoluteRangeFilterValid(from?: DateValue | null, to?: DateValue | null): boolean {
    const fromValue = from?.value;
    const toValue = to?.value;

    if (!fromValue && !toValue) return false;
    if (!isDateSideValid(from) || !isDateSideValid(to)) return false;

    const hasFrom = Boolean(fromValue);
    const hasTo = Boolean(toValue);
    if (hasFrom !== hasTo) return true;

    if (!fromValue || !toValue) return false;

    return !isFromAfterTo(fromValue, toValue);
}

const styles: Readonly<any> = (theme: any) => ({
    inputsUnderOption: {
        marginBlockStart: theme.typography.pxToRem(8),
        paddingInlineStart: theme.typography.pxToRem(24),
    },
    container: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
        gap: theme.typography.pxToRem(8),
    },
    inputContainer: {},
    toLabelContainer: {
        width: theme.typography.pxToRem(30),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: theme.typography.pxToRem(6),
        fontSize: theme.typography.body1.fontSize,
    },
    error: {
        ...theme.typography.caption,
        color: theme.palette.error.main,
    },
    logicErrorContainer: {
        paddingTop: theme.typography.pxToRem(10),
    },
});

export type AbsoluteRangeValue = {
    from?: DateValue;
    to?: DateValue;
};

type OwnProps = {
    value: AbsoluteRangeValue;
    submitAttempted?: boolean;
    onFieldBlur: (value: Partial<AbsoluteRangeValue>) => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

class AbsoluteRangeFilterPlain extends Component<Props> {
    handleFromBlur = (dateValue: DateValue) => {
        this.props.onFieldBlur({ from: dateValue });
    };

    handleToBlur = (dateValue: DateValue) => {
        this.props.onFieldBlur({ to: dateValue });
    };

    render() {
        const { value, classes, submitAttempted = false } = this.props;
        const fromValue = value?.from;
        const toValue = value?.to;
        const { dateLogicError } = getAbsoluteRangeErrors(fromValue, toValue, submitAttempted);

        return (
            <div className={classes.inputsUnderOption}>
                <div className={classes.container}>
                    <div className={classes.inputContainer} data-test="date-filter-from">
                        <D2Date
                            value={fromValue?.value ?? undefined}
                            onBlur={this.handleFromBlur}
                            placeholder={i18n.t('From')}
                            inputWidth="150px"
                            calendarWidth="330px"
                            dense
                        />
                        <div className={classes.error}>
                            {fromValue?.error ? i18n.t('Please provide a valid date') : null}
                        </div>
                    </div>
                    <div className={classes.toLabelContainer}>{i18n.t('to')}</div>
                    <div className={classes.inputContainer} data-test="date-filter-to">
                        <D2Date
                            value={toValue?.value ?? undefined}
                            onBlur={this.handleToBlur}
                            placeholder={i18n.t('To')}
                            inputWidth="150px"
                            calendarWidth="330px"
                            dense
                        />
                        <div className={classes.error}>
                            {toValue?.error ? i18n.t('Please provide a valid date') : null}
                        </div>
                    </div>
                </div>
                {dateLogicError && (
                    <div className={cx(classes.error, classes.logicErrorContainer)}>
                        {dateLogicError}
                    </div>
                )}
            </div>
        );
    }
}

export const AbsoluteRangeFilter = withStyles(styles)(AbsoluteRangeFilterPlain);
