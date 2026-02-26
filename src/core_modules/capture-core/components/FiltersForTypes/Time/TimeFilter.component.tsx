import React, { Component } from 'react';
import { InputField } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { UpdatableFilterContent } from '../types';
import type { Value } from './Time.types';
import { getTimeFilterData } from './timeFilterDataGetter';

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

const isFromAfterTo = (from: string | undefined | null, to: string | undefined | null): boolean => {
    if (!from || !to) {
        return false;
    }
    return from > to;
};

type TimeSide = 'from' | 'to';

class TimeFilterPlain extends Component<Props, State> implements UpdatableFilterContent<Value> {
    constructor(props: Props) {
        super(props);
        this.state = { submitAttempted: false };
    }

    onGetUpdateData(updatedValue?: Value) {
        const value = updatedValue === undefined ? this.props.value : updatedValue;
        if (value === undefined || value === null) {
            return null;
        }
        return getTimeFilterData(value);
    }

    onIsValid() {
        this.setState({ submitAttempted: true });
        const value = this.props.value;
        if (value === undefined || value === null) {
            return true;
        }
        const { from, to } = value;
        const hasNoTimes = !from && !to;
        const isOrderInvalid = !!from && !!to && isFromAfterTo(from, to);
        return !hasNoTimes && !isOrderInvalid;
    }

    getUpdatedValue(part: { from?: string | null } | { to?: string | null }) {
        return { ...this.props.value, ...part };
    }

    handleTimeChange = (side: TimeSide) => ({ value: timeValue }: { value: string | undefined }) => {
        const updated = this.getUpdatedValue({
            [side]: timeValue || null,
        });
        this.props.onCommitValue(updated);
    };

    getTimeLogicError() {
        const { value } = this.props;
        const { submitAttempted } = this.state;
        const hasNoTimes = !value?.from && !value?.to;
        if (hasNoTimes) {
            return submitAttempted ? i18n.t('Please specify a time range') : null;
        }
        const from = value?.from;
        const to = value?.to;
        if (from && to && isFromAfterTo(from, to)) {
            return i18n.t('The "Before" value must be after the "After" value');
        }
        return null;
    }

    render() {
        const { value, classes } = this.props;
        const fromTime = value?.from ?? '';
        const toTime = value?.to ?? '';
        const timeLogicError = this.getTimeLogicError();

        return (
            <div>
                <div className={classes.section}>
                    <div className={classes.sectionLabel}>{i18n.t('After')}</div>
                    <div className={classes.row}>
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
                        <InputField
                            placeholder={i18n.t('Time')}
                            type="time"
                            value={toTime}
                            onChange={this.handleTimeChange('to')}
                        />
                    </div>
                </div>

                {timeLogicError && (
                    <div className={classes.error}>{timeLogicError}</div>
                )}
            </div>
        );
    }
}

export const TimeFilter = withStyles(styles)(TimeFilterPlain);
