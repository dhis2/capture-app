import React, { Component } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { cx } from '@emotion/css';
import i18n from '@dhis2/d2-i18n';
import { isValidZeroOrPositiveInteger } from 'capture-core-utils/validators/form';
import { D2TextField } from '../../FormFields/Generic/D2TextField.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';

const ManagedTextField = withInternalChangeHandler()(D2TextField);

function validateRelativeRangeValue(value?: string | null): { isValid: boolean; error: string | null } {
    if (!value) {
        return { isValid: true, error: null };
    }
    const isValid = isValidZeroOrPositiveInteger(value);
    return {
        isValid,
        error: isValid ? null : i18n.t('Please provide zero or a positive integer'),
    };
}

export function getRelativeRangeErrors(
    startValue?: string | null,
    endValue?: string | null,
    submitAttempted?: boolean,
) {
    let errors: {
        startValueError: string | null;
        endValueError: string | null;
        rangeRequiredError: string | null;
    } = {
        startValueError: null,
        endValueError: null,
        rangeRequiredError: null,
    };
    if (!startValue && !endValue) {
        errors = {
            ...errors,
            rangeRequiredError: submitAttempted ? i18n.t('Please specify the number of days') : null,
        };
    }
    const { error: startValueError } = validateRelativeRangeValue(startValue);
    const { error: endValueError } = validateRelativeRangeValue(endValue);
    errors = { ...errors, startValueError, endValueError };
    return errors;
}

export function isRelativeRangeFilterValid(
    startValue?: string | null,
    endValue?: string | null,
): boolean {
    if (!startValue && !endValue) return false;
    if (
        !validateRelativeRangeValue(startValue).isValid ||
        !validateRelativeRangeValue(endValue).isValid
    ) {
        return false;
    }
    return true;
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
    inputContainer: {
        width: '150px',
    },
    toLabelContainer: {
        paddingTop: theme.typography.pxToRem(6),
        paddingInline: theme.typography.pxToRem(10),
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

export type RelativeRangeValue = {
    start?: string | null;
    end?: string | null;
};

type OwnProps = {
    value: RelativeRangeValue;
    submitAttempted?: boolean;
    onFieldBlur: (value: Partial<RelativeRangeValue>) => void;
    onFieldChange?: (value: Partial<RelativeRangeValue>) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

class RelativeRangeFilterPlain extends Component<Props> {
    handleStartChange = (value: string) => {
        this.props.onFieldChange?.({ start: value.trim() });
    };

    handleEndChange = (value: string) => {
        this.props.onFieldChange?.({ end: value.trim() });
    };

    handleStartBlur = (value: string) => {
        this.props.onFieldBlur({ start: value.trim() });
    };

    handleEndBlur = (value: string) => {
        this.props.onFieldBlur({ end: value.trim() });
    };

    handleKeyDown = (_payload: { value?: string }, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            this.props.onKeyDown?.(e);
        }
    };

    render() {
        const { value, classes, submitAttempted = false } = this.props;
        const { startValueError, endValueError, rangeRequiredError } = getRelativeRangeErrors(
            value?.start,
            value?.end,
            submitAttempted,
        );
        return (
            <div className={classes.inputsUnderOption}>
                <div className={classes.container}>
                    <div className={classes.inputContainer}>
                        <ManagedTextField
                            value={value?.start ?? ''}
                            onChange={this.handleStartChange}
                            onBlur={this.handleStartBlur}
                            onKeyDown={this.handleKeyDown}
                            placeholder={i18n.t('Days in the past')}
                            dataTest="date-range-filter-start"
                        />
                        <div className={classes.error}>{startValueError}</div>
                    </div>
                    <div className={classes.toLabelContainer}>{i18n.t('to')}</div>
                    <div className={classes.inputContainer}>
                        <ManagedTextField
                            value={value?.end ?? ''}
                            onChange={this.handleEndChange}
                            onBlur={this.handleEndBlur}
                            onKeyDown={this.handleKeyDown}
                            placeholder={i18n.t('Days in the future')}
                            dataTest="date-range-filter-end"
                        />
                        <div className={classes.error}>{endValueError}</div>
                    </div>
                </div>
                {rangeRequiredError && (
                    <div className={cx(classes.error, classes.logicErrorContainer)}>
                        {rangeRequiredError}
                    </div>
                )}
            </div>
        );
    }
}

export const RelativeRangeFilter = withStyles(styles)(RelativeRangeFilterPlain);
