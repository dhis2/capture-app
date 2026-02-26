import React, { Component } from 'react';
import { InputField } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { D2Date } from '../../FormFields/DateAndTime/D2Date/D2Date.component';
import type { UpdatableFilterContent } from '../types';
import type { DateValue } from '../Date/types/date.types';
import type { DateTimeValue } from './types/dateTime.types';
import type { Value } from './DateTime.types';
import { getDateTimeFilterData } from './dateTimeFilterDataGetter';
import '../Date/calendarFilterStyles.css';

const styles: Readonly<any> = (theme: any) => {
    const rem = (px: number) => theme.typography.pxToRem(px);
    return {
        section: {
            marginBlockEnd: rem(12),
        },
        sectionLabel: {
            ...theme.typography.caption,
            display: 'block',
            marginBlockEnd: rem(4),
            color: theme.palette.text.secondary,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
        },
        row: {
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            gap: rem(8),
        },
        error: {
            ...theme.typography.caption,
            marginBlockStart: rem(6),
            color: theme.palette.error.main,
        },
    };
};

type OwnProps = {
    onCommitValue: (value: Value) => void;
    value: Value;
};

type Props = OwnProps & WithStyles<typeof styles>;

type State = {
    submitAttempted: boolean;
};

const isFromAfterTo = (from: DateTimeValue, to: DateTimeValue): boolean => {
    if (!from.date || !to.date) {
        return false;
    }
    const fromTime = from.time || '00:00';
    const toTime = to.time || '00:00';
    const fromStr = `${from.date}T${fromTime}`;
    const toStr = `${to.date}T${toTime}`;
    return fromStr > toStr;
};

const getDisplayTime = (date: string | undefined | null, time: string | undefined | null): string => (
    date ? (time ?? '00:00') : (time ?? '')
);

type DateTimeSide = 'from' | 'to';

class DateTimeFilterPlain extends Component<Props, State> implements UpdatableFilterContent<Value> {
    constructor(props: Props) {
        super(props);
        this.state = { submitAttempted: false };
    }

    onGetUpdateData(updatedValue?: Value) {
        const value = updatedValue === undefined ? this.props.value : updatedValue;
        if (value === undefined || value === null) {
            return null;
        }
        return getDateTimeFilterData(value);
    }

    onIsValid() {
        this.setState({ submitAttempted: true });
        const value = this.props.value;
        if (value === undefined || value === null) {
            return true;
        }
        const { from, to } = value;
        const hasNoDates = !from?.date && !to?.date;
        const hasInvalidDate = from?.isValid === false || to?.isValid === false;
        const isOrderInvalid = !!from && !!to && isFromAfterTo(from, to);
        return !hasNoDates && !hasInvalidDate && !isOrderInvalid;
    }

    getUpdatedValue(part: { from?: DateTimeValue | null } | { to?: DateTimeValue | null }) {
        return { ...this.props.value, ...part };
    }

    handleDateBlur = (side: DateTimeSide) => (dateValue: DateValue) => {
        const current = this.props.value?.[side];
        const updated = this.getUpdatedValue({
            [side]: {
                ...current,
                date: dateValue.value,
                time: current?.time ?? '00:00',
                error: dateValue.error,
                isValid: dateValue.isValid,
            },
        });
        this.props.onCommitValue(updated);
    };

    handleTimeChange = (side: DateTimeSide) => ({ value: timeValue }: { value: string | undefined }) => {
        const updated = this.getUpdatedValue({
            [side]: { ...this.props.value?.[side], time: timeValue || null },
        });
        this.props.onCommitValue(updated);
    };

    // eslint-disable-next-line complexity
    getDateLogicError() {
        const { value } = this.props;
        const { submitAttempted } = this.state;
        const from = value?.from;
        const to = value?.to;
        if (from?.isValid === false || to?.isValid === false) {
            return i18n.t('Please provide a valid date');
        }
        if (!from?.date && !to?.date) {
            return submitAttempted ? i18n.t('Please specify a date') : null;
        }
        if (from?.date && to?.date && isFromAfterTo(from, to)) {
            return i18n.t('The "Before" value must be after the "After" value');
        }
        return null;
    }

    render() {
        const { value, classes } = this.props;
        const fromDate = value?.from?.date ?? undefined;
        const fromTime = getDisplayTime(value?.from?.date, value?.from?.time);
        const toDate = value?.to?.date ?? undefined;
        const toTime = getDisplayTime(value?.to?.date, value?.to?.time);
        const dateLogicError = this.getDateLogicError();

        return (
            <div>
                <div className={classes.section}>
                    <div className={classes.sectionLabel}>{i18n.t('After')}</div>
                    <div className={classes.row}>
                        <D2Date
                            value={fromDate}
                            onBlur={this.handleDateBlur('from')}
                            placeholder={i18n.t('Date')}
                            inputWidth="150px"
                            calendarWidth="330px"
                        />
                        <InputField
                            placeholder={i18n.t('Time')}
                            type="time"
                            value={fromTime}
                            onChange={this.handleTimeChange('from')}
                        />
                    </div>
                </div>

                <div className={classes.section}>
                    <div className={classes.sectionLabel}>{i18n.t('Before')}</div>
                    <div className={classes.row}>
                        <D2Date
                            value={toDate}
                            onBlur={this.handleDateBlur('to')}
                            placeholder={i18n.t('Date')}
                            inputWidth="150px"
                            calendarWidth="330px"
                        />
                        <InputField
                            type="time"
                            value={toTime}
                            placeholder={i18n.t('Time')}
                            onChange={this.handleTimeChange('to')}
                        />
                    </div>
                </div>

                {dateLogicError && (
                    <div className={classes.error}>{dateLogicError}</div>
                )}
            </div>
        );
    }
}

export const DateTimeFilter = withStyles(styles)(DateTimeFilterPlain);
