// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import SelectBoxes from '../../FormFields/Options/SingleSelectBoxes/SingleSelectBoxes.component';
import { orientations } from '../../FormFields/Options/SingleSelectBoxes/singleSelectBoxes.const';
import OptionSet from '../../../metaData/OptionSet/OptionSet';
import Option from '../../../metaData/OptionSet/Option';

import moment from '../../../utils/moment/momentResolver';
import From from './From.component';
import To from './To.component';
import {
    isValidDate,
} from '../../../utils/validators/form';
import { convertValue as convertToClientValue } from '../../../converters/formToClient';
import { convertValue as convertToFormValue } from '../../../converters/clientToForm';
import elementTypes from '../../../metaData/DataElement/elementTypes';
import type { UpdatableFilterContent } from '../filters.types';
import './calendarFilterStyles.css';

const getStyles = (theme: Theme) => ({
    fromToContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    inputContainer: {
    },
    toLabelContainer: {
        width: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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

type Value = ?{
    from?: ?string,
    to?: ?string,
    main?: ?string,
};

type Props = {
    onCommitValue: (value: ?{ from?: ?string, to?: ?string }) => void,
    onUpdate: (commitValue?: any) => void,
    value: Value,
    type: $Values<typeof elementTypes>,
    classes: {
        fromToContainer: string,
        inputContainer: string,
        error: string,
        logicErrorContainer: string,
        toLabelContainer: string,
    },
    onFocusUpdateButton: () => void,
};

type State = {
    submitAttempted: boolean;
};

// $FlowSuppress
class DateFilter extends Component<Props, State> implements UpdatableFilterContent<Value> {
    static errorMessages = {
        CUSTOM_RANGE_WITHOUT_VALUES: 'Please specify a range',
        FROM_GREATER_THAN_TO: 'The From date can\'t be after the To date',
        [elementTypes.DATE]: 'Please provide a valid date',
    };

    static validatorForTypes = {
        [elementTypes.DATE]: isValidDate,
    };

    static mainOptionKeys = {
        LAST_WEEK: 'lastWeek',
        LAST_MONTH: 'lastMonth',
        LAST_3_MONTHS: 'last3Months',
        CUSTOM_RANGE: 'customRange',
    };

    static mainOptionsTranslatedTexts = {
        [DateFilter.mainOptionKeys.LAST_WEEK]: i18n.t('Last week'),
        [DateFilter.mainOptionKeys.LAST_MONTH]: i18n.t('Last month'),
        [DateFilter.mainOptionKeys.LAST_3_MONTHS]: i18n.t('Last 3 months'),
        [DateFilter.mainOptionKeys.CUSTOM_RANGE]: i18n.t('Custom range'),
    };

    static mainOptionSet = new OptionSet('mainOptions', [
        new Option((_this) => {
            _this.text = DateFilter.mainOptionsTranslatedTexts[DateFilter.mainOptionKeys.LAST_WEEK];
            _this.value = DateFilter.mainOptionKeys.LAST_WEEK;
        }),
        new Option((_this) => {
            _this.text = DateFilter.mainOptionsTranslatedTexts[DateFilter.mainOptionKeys.LAST_MONTH];
            _this.value = DateFilter.mainOptionKeys.LAST_MONTH;
        }),
        new Option((_this) => {
            _this.text = DateFilter.mainOptionsTranslatedTexts[DateFilter.mainOptionKeys.LAST_3_MONTHS];
            _this.value = DateFilter.mainOptionKeys.LAST_3_MONTHS;
        }),
        new Option((_this) => {
            _this.text = DateFilter.mainOptionsTranslatedTexts[DateFilter.mainOptionKeys.CUSTOM_RANGE];
            _this.value = DateFilter.mainOptionKeys.CUSTOM_RANGE;
        }),
    ]);

    static formatDateForFilterRequest(dateMoment: moment$Moment) {
        return dateMoment.format('YYYY-MM-DD');
    }

    static convertDateFilterValueToClientValue(formValue: string): string {
        // $FlowSuppress
        return convertToClientValue(formValue, elementTypes.DATE);
    }

    static convertDateFilterValueToFormValue(clientValue: string): string {
        // $FlowSuppress
        return convertToFormValue(clientValue, elementTypes.DATE);
    }

    static mapMainSelectionsToRequests = {
        [DateFilter.mainOptionKeys.LAST_WEEK]: () => {
            const startDate = moment().subtract(1, 'weeks').startOf('week');
            const endDate = moment().subtract(1, 'weeks').endOf('week');

            return [
                `ge:${DateFilter.formatDateForFilterRequest(startDate)}`,
                `le:${DateFilter.formatDateForFilterRequest(endDate)}`,
            ];
        },
        [DateFilter.mainOptionKeys.LAST_MONTH]: () => {
            const startDate = moment().subtract(1, 'months').startOf('month');
            const endDate = moment().subtract(1, 'months').endOf('month');

            return [
                `ge:${DateFilter.formatDateForFilterRequest(startDate)}`,
                `le:${DateFilter.formatDateForFilterRequest(endDate)}`,
            ];
        },
        [DateFilter.mainOptionKeys.LAST_3_MONTHS]: () => {
            const startDate = moment().subtract(3, 'months').startOf('month');
            const endDate = moment().subtract(1, 'months').endOf('month');

            return [
                `ge:${DateFilter.formatDateForFilterRequest(startDate)}`,
                `le:${DateFilter.formatDateForFilterRequest(endDate)}`,
            ];
        },
        [DateFilter.mainOptionKeys.CUSTOM_RANGE]: (fromValue: ?string, toValue: ?string) => {
            const requestData = [];
            if (fromValue) {
                // $FlowSuppress
                const fromClientValue: string = DateFilter.convertDateFilterValueToClientValue(fromValue);
                const fromFilterRequest = DateFilter.formatDateForFilterRequest(moment(fromClientValue));
                requestData.push(`ge:${fromFilterRequest}`);
            }
            if (toValue) {
                // $FlowSuppress
                const toClientValue: string = DateFilter.convertDateFilterValueToClientValue(toValue);
                const toFilterRequest = DateFilter.formatDateForFilterRequest(moment(toClientValue));
                requestData.push(`le:${toFilterRequest}`);
            }
            return requestData;
        },
    };

    static mapMainSelectionsToAppliedText = {
        [DateFilter.mainOptionKeys.LAST_WEEK]: () =>
            DateFilter.mainOptionsTranslatedTexts[DateFilter.mainOptionKeys.LAST_WEEK],
        [DateFilter.mainOptionKeys.LAST_MONTH]: () =>
            DateFilter.mainOptionsTranslatedTexts[DateFilter.mainOptionKeys.LAST_MONTH],
        [DateFilter.mainOptionKeys.LAST_3_MONTHS]: () =>
            DateFilter.mainOptionsTranslatedTexts[DateFilter.mainOptionKeys.LAST_3_MONTHS],
        [DateFilter.mainOptionKeys.CUSTOM_RANGE]: (fromValue: ?string, toValue: ?string) => {
            let appliedText = '';
            if (fromValue && toValue) {
                const valueFromClient = DateFilter.convertDateFilterValueToClientValue(fromValue);
                const valueToClient = DateFilter.convertDateFilterValueToClientValue(toValue);
                const momentFrom = moment(valueFromClient);
                const momentTo = moment(valueToClient);
                if (momentFrom.isSame(momentTo)) {
                    appliedText = DateFilter.convertDateFilterValueToFormValue(valueFromClient);
                } else {
                    const appliedTextFrom = DateFilter.convertDateFilterValueToFormValue(valueFromClient);
                    const appliedTextTo = DateFilter.convertDateFilterValueToFormValue(valueToClient);
                    appliedText = `${appliedTextFrom} ${i18n.t('to')} ${appliedTextTo}`;
                }
            } else if (fromValue) {
                const valueFromClient = DateFilter.convertDateFilterValueToClientValue(fromValue);
                const appliedTextFrom = DateFilter.convertDateFilterValueToFormValue(valueFromClient);
                appliedText = `${i18n.t('after or equal to')} ${appliedTextFrom}`;
            } else {
                // $FlowSuppress
                const valueToClient = DateFilter.convertDateFilterValueToClientValue(toValue);
                const appliedTextTo = DateFilter.convertDateFilterValueToFormValue(valueToClient);
                appliedText = `${i18n.t('before or equal to')} ${appliedTextTo}`;
            }
            return appliedText;
        },
    };

    static validateField(value: ?string, type: $Values<typeof elementTypes>) {
        if (!value) {
            return {
                isValid: true,
                error: null,
            };
        }

        const typeValidator = DateFilter.validatorForTypes[type];
        const isValid = typeValidator(value);

        return {
            isValid,
            error: isValid ? null : i18n.t(DateFilter.errorMessages[type]),
        };
    }

    static isFilterValid(
        mainValue?: ?string,
        fromValue?: ?string,
        toValue?: ?string,
        type: $Values<typeof elementTypes>,
    ) {
        if (mainValue === DateFilter.mainOptionKeys.CUSTOM_RANGE && !fromValue && !toValue) {
            return false;
        }

        if (!(DateFilter.validateField(fromValue, type).isValid &&
            DateFilter.validateField(fromValue, type).isValid)) {
            return false;
        }

        return !(fromValue && toValue && this.isFromAfterTo(fromValue, toValue));
    }

    static getRequestData(value: { main: string, from?: ?string, to?: ?string }) {
        return DateFilter.mapMainSelectionsToRequests[value.main](value.from, value.to);
    }

    static getAppliedText(value: { main: string, from?: ?string, to?: ?string }) {
        return DateFilter.mapMainSelectionsToAppliedText[value.main](value.from, value.to);
    }

    static isFromAfterTo(valueFrom: string, valueTo: string) {
        const valueFromClient = DateFilter.convertDateFilterValueToClientValue(valueFrom);
        const valueToClient = DateFilter.convertDateFilterValueToClientValue(valueTo);

        // $FlowSuppress
        const momentFrom = moment(valueFromClient);
        // $FlowSuppress
        const momentTo = moment(valueToClient);
        return momentFrom.isAfter(momentTo);
    }

    toD2DateTextFieldInstance: any;
    constructor(props: Props) {
        super(props);
        this.state = { submitAttempted: false };
    }
    onGetUpdateData(updatedValues?: Value) {
        const value = typeof updatedValues !== 'undefined' ? updatedValues : this.props.value;

        if (!value) {
            return null;
        }

        return {
            // $FlowSuppress
            requestData: DateFilter.getRequestData(value),
            // $FlowSuppress
            appliedText: DateFilter.getAppliedText(value),
        };
    }

    onIsValid() {
        this.setState({ submitAttempted: true });
        const values = this.props.value;
        return !values || DateFilter.isFilterValid(values.main, values.from, values.to, this.props.type);
    }

    getUpdatedValue(valuePart: {[key: string]: string}) {
        const valueObject = {
            ...this.props.value,
            ...valuePart,
        };

        if (valueObject.from || valueObject.to) {
            valueObject.main = DateFilter.mainOptionKeys.CUSTOM_RANGE;
        } else if (valueObject.main === DateFilter.mainOptionKeys.CUSTOM_RANGE) {
            valueObject.main = null;
        }

        return Object
            .keys(valueObject)
            .filter(key => valueObject[key])
            .length > 0 ? valueObject : null;
    }

    handleEnterKeyInFrom = () => {
        this.toD2DateTextFieldInstance.focus();
    }

    handleDateSelectedFromCalendarInFrom = () => {
        this.toD2DateTextFieldInstance.focus();
    }

    handleEnterKeyInTo = (value: {[key: string]: string}) => {
        // validate with updated values
        const values = this.getUpdatedValue(value);
        this.setState({ submitAttempted: true });

        if (values && !DateFilter.isFilterValid(values.main, values.from, values.to, this.props.type)) {
            this.props.onCommitValue(values);
        } else {
            this.props.onUpdate(values || null);
        }
    }

    handleFieldBlur = (value: {[key: string]: string}) => {
        this.props.onCommitValue(this.getUpdatedValue(value));
    }

    handleMainSelect = (value: string) => {
        const valueObject = value ? { main: value } : null;
        this.props.onCommitValue(valueObject);
    }

    setToD2DateTextFieldInstance = (instance: any) => {
        this.toD2DateTextFieldInstance = instance;
    }

    getErrors() {
        const values = this.props.value;
        const submitAttempted = this.state.submitAttempted;
        const mainValue = values && values.main;
        const fromValue = values && values.from;
        const toValue = values && values.to;
        const type = this.props.type;

        if (mainValue === DateFilter.mainOptionKeys.CUSTOM_RANGE && !fromValue && !toValue) {
            return {
                minValueError: null,
                maxValueError: null,
                logicError: submitAttempted ? i18n.t(DateFilter.errorMessages.CUSTOM_RANGE_WITHOUT_VALUES) : null,
            };
        }

        const { isValid: isMinValueValid, error: minValueError } = DateFilter.validateField(fromValue, type);
        const { isValid: isMaxValueValid, error: maxValueError } = DateFilter.validateField(toValue, type);

        let logicError = null;
        if (isMinValueValid && isMaxValueValid && fromValue && toValue &&
            DateFilter.isFromAfterTo(fromValue, toValue)) {
            logicError = i18n.t(DateFilter.errorMessages.FROM_GREATER_THAN_TO);
        }

        return {
            minValueError,
            maxValueError,
            logicError,
        };
    }

    render() {
        const { value, classes, onFocusUpdateButton } = this.props;
        const { minValueError, maxValueError, logicError } = this.getErrors();
        return (
            <div id="dateFilter">
                <div>
                    <SelectBoxes
                        optionSet={DateFilter.mainOptionSet}
                        orientation={orientations.VERTICAL}
                        value={value && value.main}
                        onBlur={this.handleMainSelect}
                        color="secondary"
                        nullable
                    />
                </div>
                <div className={classes.fromToContainer}>
                    <div
                        className={classes.inputContainer}
                    >
                        { /* $FlowSuppress: Flow not working 100% with HOCs */ }
                        <From
                            value={value && value.from}
                            error={minValueError}
                            errorClass={classes.error}
                            onBlur={this.handleFieldBlur}
                            onEnterKey={this.handleEnterKeyInFrom}
                            onDateSelectedFromCalendar={this.handleDateSelectedFromCalendarInFrom}
                        />
                    </div>
                    <div
                        className={classes.toLabelContainer}
                    >
                        { i18n.t('to') }
                    </div>
                    <div
                        className={classes.inputContainer}
                    >
                        { /* $FlowSuppress: Flow not working 100% with HOCs */ }
                        <To
                            value={value && value.to}
                            error={maxValueError}
                            errorClass={classes.error}
                            onBlur={this.handleFieldBlur}
                            onEnterKey={this.handleEnterKeyInTo}
                            textFieldRef={this.setToD2DateTextFieldInstance}
                            onFocusUpdateButton={onFocusUpdateButton}
                        />
                    </div>
                </div>
                <div className={classNames(classes.error, classes.logicErrorContainer)}>
                    {logicError}
                </div>
            </div>
        );
    }
}

export default withStyles(getStyles)(DateFilter);
