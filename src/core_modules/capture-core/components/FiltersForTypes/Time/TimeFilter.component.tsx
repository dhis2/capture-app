import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { cx } from '@emotion/css';
import type { UpdatableFilterContent } from '../types';
import type { Value } from './Time.types';
import { getTimeFilterData } from './timeFilterDataGetter';
import { TimeFilterInput } from './TimeFilterInput.component';

const getStyles: Readonly<any> = (theme: any) => {
    const rem = (px: number) => theme.typography.pxToRem(px);
    return {
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: rem(8),
        },
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
        logicErrorContainer: {
            paddingTop: rem(10),
        },
    };
};

type OwnProps = {
    onCommitValue: (value: Value) => void;
    value: Value;
    onUpdate: (commitValue?: Value) => void;
};

type Props = OwnProps & WithStyles<typeof getStyles>;

type State = {
    committedValue: Value;
};

const isFromAfterTo = (from: string | undefined | null, to: string | undefined | null): boolean => {
    if (!from || !to) {
        return false;
    }
    return from > to;
};

type ValuePart = { from?: string | null } | { to?: string | null };

class TimeFilterPlain extends Component<Props, State> implements UpdatableFilterContent<Value> {
    static isFilterValid(value: Value): boolean {
        if (value === undefined || value === null) {
            return true;
        }
        const { from, to } = value;
        const hasNoTimes = !from && !to;
        const isOrderInvalid = !!from && !!to && isFromAfterTo(from, to);
        return !hasNoTimes && !isOrderInvalid;
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            committedValue: props.value,
        };
    }

    onGetUpdateData(updatedValue?: Value) {
        const value = updatedValue === undefined ? this.props.value : updatedValue;
        if (value === undefined || value === null) {
            return null;
        }
        return getTimeFilterData(value);
    }

    onIsValid() {
        const value = this.props.value;
        if (value === undefined || value === null) {
            return true;
        }
        const { from, to } = value;
        const hasNoTimes = !from && !to;
        const isOrderInvalid = !!from && !!to && isFromAfterTo(from, to);
        return !hasNoTimes && !isOrderInvalid;
    }

    getUpdatedValue(valuePart: ValuePart): Value {
        const valueObject = {
            ...this.props.value,
            ...valuePart,
        };
        const hasFrom = valueObject.from !== undefined && valueObject.from !== null && valueObject.from !== '';
        const hasTo = valueObject.to !== undefined && valueObject.to !== null && valueObject.to !== '';
        return hasFrom || hasTo ? valueObject : null;
    }

    handleFieldBlur = (valuePart: ValuePart) => {
        const updated = this.getUpdatedValue(valuePart);
        this.setState({ committedValue: updated });
        this.props.onCommitValue(updated);
    };

    handleEnterKey = (valuePart: ValuePart) => {
        const updated = this.getUpdatedValue(valuePart);
        this.setState({ committedValue: updated });
        if (updated && !TimeFilterPlain.isFilterValid(updated)) {
            this.props.onCommitValue(updated);
        } else {
            this.props.onUpdate(updated ?? undefined);
        }
    };

    handleFromChange = (value: string) => {
        this.props.onCommitValue(this.getUpdatedValue({ from: value || null }));
    };

    handleToChange = (value: string) => {
        this.props.onCommitValue(this.getUpdatedValue({ to: value || null }));
    };

    getTimeLogicError() {
        const values = this.state.committedValue;
        if (values === undefined || values === null) {
            return null;
        }
        const hasNoTimes = !values.from && !values.to;
        if (hasNoTimes) {
            return null;
        }
        const { from, to } = values;
        if (from && to && isFromAfterTo(from, to)) {
            return i18n.t('The "Before" value must be after the "After" value');
        }
        return null;
    }

    render() {
        const { value, classes } = this.props;
        const timeLogicError = this.getTimeLogicError();

        return (
            <div>
                <div className={classes.container}>
                    <div className={classes.section}>
                        <div className={classes.sectionLabel}>{i18n.t('After')}</div>
                        <div className={classes.row}>
                            <TimeFilterInput
                                field="from"
                                value={value?.from}
                                onBlur={this.handleFieldBlur}
                                onEnterKey={this.handleEnterKey}
                                onChange={this.handleFromChange}
                            />
                        </div>
                    </div>
                    <div className={classes.section}>
                        <div className={classes.sectionLabel}>{i18n.t('Before')}</div>
                        <div className={classes.row}>
                            <TimeFilterInput
                                field="to"
                                value={value?.to}
                                onBlur={this.handleFieldBlur}
                                onEnterKey={this.handleEnterKey}
                                onChange={this.handleToChange}
                            />
                        </div>
                    </div>
                </div>
                <div className={cx(classes.error, classes.logicErrorContainer)}>
                    {timeLogicError}
                </div>
            </div>
        );
    }
}

export const TimeFilter = withStyles(getStyles)(TimeFilterPlain);
