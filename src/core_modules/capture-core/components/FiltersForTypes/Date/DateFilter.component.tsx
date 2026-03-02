import React, { Component } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { Radio } from '@dhis2/ui';
import { OptionSet } from '../../../metaData/OptionSet/OptionSet';
import { Option } from '../../../metaData/OptionSet/Option';
import type { UpdatableFilterContent } from '../types';
import type { DateValue } from './types';
import './calendarFilterStyles.css';
import { mainOptionKeys, mainOptionTranslatedTexts } from './options';
import { getDateFilterData } from './dateFilterDataGetter';
import {
    AbsoluteRangeFilter,
    isAbsoluteRangeFilterValid,
} from './AbsoluteRangeFilter.component';
import {
    RelativeRangeFilter,
    isRelativeRangeFilterValid,
} from './RelativeRangeFilter.component';

const styles: Readonly<any> = (theme: any) => ({
    sectionLabel: {
        ...theme.typography.body2,
        display: 'block',
        marginBlockEnd: theme.typography.pxToRem(6),
        color: theme.palette.text.secondary,
        fontWeight: 600,
    },
    optionsSection: {
        marginBlockEnd: theme.typography.pxToRem(16),
    },
    optionRow: {
        marginBlockEnd: theme.typography.pxToRem(16),
    },
});

export type Value = {
    from?: DateValue;
    to?: DateValue;
    main?: string;
    start?: string;
    end?: string;
} | undefined;

type OwnProps = {
    onCommitValue: (value?: Value, isBlur?: boolean) => void;
    value: Value;
    onUpdate?: () => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

type State = {
    submitAttempted: boolean;
};

class DateFilterPlain extends Component<Props, State> implements UpdatableFilterContent<Value> {
    static isFilterValid(
        mainValue?: string | null,
        fromValue?: DateValue | null,
        toValue?: DateValue | null,
        startValue?: string | null,
        endValue?: string | null,
    ) {
        if (mainValue === mainOptionKeys.ABSOLUTE_RANGE) {
            return isAbsoluteRangeFilterValid(fromValue, toValue);
        }
        if (mainValue === mainOptionKeys.RELATIVE_RANGE) {
            return isRelativeRangeFilterValid(startValue, endValue);
        }
        return true;
    }

    constructor(props: Props) {
        super(props);
        this.state = { submitAttempted: false };
    }

    static mainOptionSet = new OptionSet('mainOptions', [
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.TODAY];
            _this.value = mainOptionKeys.TODAY;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.THIS_WEEK];
            _this.value = mainOptionKeys.THIS_WEEK;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.THIS_MONTH];
            _this.value = mainOptionKeys.THIS_MONTH;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.THIS_YEAR];
            _this.value = mainOptionKeys.THIS_YEAR;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.LAST_WEEK];
            _this.value = mainOptionKeys.LAST_WEEK;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.LAST_MONTH];
            _this.value = mainOptionKeys.LAST_MONTH;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.LAST_3_MONTHS];
            _this.value = mainOptionKeys.LAST_3_MONTHS;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.ABSOLUTE_RANGE];
            _this.value = mainOptionKeys.ABSOLUTE_RANGE;
        }),
        new Option((_this) => {
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.RELATIVE_RANGE];
            _this.value = mainOptionKeys.RELATIVE_RANGE;
        }),
    ]);

    onGetUpdateData(updatedValues?: Value) {
        const value = typeof updatedValues !== 'undefined' ? updatedValues : this.props.value;
        if (!value) return null;
        return getDateFilterData(value as any);
    }

    onIsValid() {
        this.setState({ submitAttempted: true });
        const values = this.props.value;
        return !values || DateFilterPlain.isFilterValid(
            values.main, values.from, values.to, values.start, values.end,
        );
    }

    getUpdatedValue(valuePart: any) {
        const valueObject = {
            ...this.props.value,
            ...valuePart,
        };
        const isAbsoluteRangeValue = () => valueObject?.from || valueObject?.to;
        const isRelativeRangeValue = () => valueObject?.start || valueObject?.end;

        if (isAbsoluteRangeValue()) {
            valueObject.main = mainOptionKeys.ABSOLUTE_RANGE;
            delete valueObject.start;
            delete valueObject.end;
        } else if (isRelativeRangeValue()) {
            valueObject.main = mainOptionKeys.RELATIVE_RANGE;
            delete valueObject.from;
            delete valueObject.to;
        } else if (
            valueObject.main === mainOptionKeys.ABSOLUTE_RANGE ||
            valueObject.main === mainOptionKeys.RELATIVE_RANGE
        ) {
            valueObject.main = null;
        }

        return Object.keys(valueObject).some(key => valueObject[key]) ? valueObject : undefined;
    }

    handleFieldBlur = (value: Value) => {
        this.props.onCommitValue(this.getUpdatedValue(value), true);
    };

    handleFieldChange = (value: Value) => {
        this.props.onCommitValue(this.getUpdatedValue(value), false);
    };

    handleMainSelect = (value: string | null) => {
        const valueObject = value == null ? undefined : { main: value };
        this.props.onCommitValue(valueObject, true);
    };

    handlePeriodRadioChange = (optionValue: string) => (e: { checked: boolean }) => {
        const next = e.checked ? optionValue : null;
        this.handleMainSelect(next);
    };

    handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.props.onUpdate?.();
        }
    };

    renderPeriodOption = (option: Option) => {
        const { value, classes } = this.props;
        const isAbsoluteRange =
            option.value === mainOptionKeys.ABSOLUTE_RANGE &&
            value?.main === mainOptionKeys.ABSOLUTE_RANGE;
        const isRelativeRange =
            option.value === mainOptionKeys.RELATIVE_RANGE &&
            value?.main === mainOptionKeys.RELATIVE_RANGE;

        return (
            <div key={option.value as string} className={classes.optionRow}>
                <Radio
                    checked={value?.main === option.value}
                    label={option.text}
                    name="dateFilterMain"
                    value={option.value as string}
                    onChange={this.handlePeriodRadioChange(option.value as string)}
                    dense
                />
                {isAbsoluteRange && (
                    <AbsoluteRangeFilter
                        value={{ from: value?.from, to: value?.to }}
                        submitAttempted={this.state.submitAttempted}
                        onFieldBlur={this.handleFieldBlur}
                        onFieldChange={this.handleFieldChange}
                        onKeyDown={this.handleKeyDown}
                    />
                )}
                {isRelativeRange && (
                    <RelativeRangeFilter
                        value={{ start: value?.start, end: value?.end }}
                        submitAttempted={this.state.submitAttempted}
                        onFieldBlur={this.handleFieldBlur}
                        onFieldChange={this.handleFieldChange}
                        onKeyDown={this.handleKeyDown}
                    />
                )}
            </div>
        );
    };

    render() {
        const { classes } = this.props;

        return (
            <div id="dateFilter">
                <div className={classes.optionsSection}>
                    <span className={classes.sectionLabel}>
                        {i18n.t('Period')}
                    </span>
                    <div
                        role="radiogroup"
                        aria-label={i18n.t('Period')}
                        tabIndex={-1}
                        onKeyDown={this.handleKeyDown}
                    >
                        {DateFilterPlain.mainOptionSet.options.map(this.renderPeriodOption)}
                    </div>
                </div>
            </div>
        );
    }
}

export const DateFilter = withStyles(styles)(DateFilterPlain);
