// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import SelectBoxes from '../../FormFields/Options/SingleSelectBoxes/SingleSelectBoxes.component';
import { orientations } from '../../FormFields/Options/SingleSelectBoxes/singleSelectBoxes.const';
import OptionSet from '../../../metaData/OptionSet/OptionSet';
import Option from '../../../metaData/OptionSet/Option';

import moment from 'capture-core-utils/moment/momentResolver';
import From from './From.component';
import To from './To.component';
import {
    isValidDate,
} from '../../../utils/validators/form';
import { convertValue as convertToClientValue } from '../../../converters/formToClient';
import elementTypes from '../../../metaData/DataElement/elementTypes';
import type { UpdatableFilterContent } from '../filters.types';
import './calendarFilterStyles.css';
import { mainOptionKeys, mainOptionTranslatedTexts } from './mainOptions';
import getDateFilterData from './getDateFilterData';

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
            _this.text = mainOptionTranslatedTexts[mainOptionKeys.CUSTOM_RANGE];
            _this.value = mainOptionKeys.CUSTOM_RANGE;
        }),
    ]);

    static convertDateFilterValueToClientValue(formValue: string): string {
        // $FlowSuppress
        return convertToClientValue(formValue, elementTypes.DATE);
    }

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
        if (mainValue === mainOptionKeys.CUSTOM_RANGE && !fromValue && !toValue) {
            return false;
        }

        if (!(DateFilter.validateField(fromValue, type).isValid &&
            DateFilter.validateField(fromValue, type).isValid)) {
            return false;
        }

        return !(fromValue && toValue && this.isFromAfterTo(fromValue, toValue));
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
        // $FlowFixMe
        return getDateFilterData(value);
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
            valueObject.main = mainOptionKeys.CUSTOM_RANGE;
        } else if (valueObject.main === mainOptionKeys.CUSTOM_RANGE) {
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

        if (mainValue === mainOptionKeys.CUSTOM_RANGE && !fromValue && !toValue) {
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
