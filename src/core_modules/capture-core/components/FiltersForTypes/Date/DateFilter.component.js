// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import SelectBoxes from '../../FormFields/Options/SingleSelectBoxes/SingleSelectBoxes.component';
import { orientations } from '../../FormFields/Options/SingleSelectBoxes/singleSelectBoxes.const';
import OptionSet from '../../../metaData/OptionSet/OptionSet';
import Option from '../../../metaData/OptionSet/Option';

import From from './From.component';
import To from './To.component';
import {
    isValidDate,
} from '../../../utils/validators/form';
import { parseDate } from '../../../utils/converters/date';
import { dataElementTypes as elementTypes } from '../../../metaData';
import type { UpdatableFilterContent } from '../types';
import './calendarFilterStyles.css';
import { mainOptionKeys, mainOptionTranslatedTexts } from './mainOptions';
import { getDateFilterData } from './dateFilterDataGetter';

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

export type Value = ?{
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
// $FlowFixMe[incompatible-variance] automated comment
class DateFilter extends Component<Props, State> implements UpdatableFilterContent<Value> {
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

    // eslint-disable-next-line complexity
    static isFilterValid(
        mainValue?: ?string,
        fromValue?: ?string,
        toValue?: ?string,
    ) {
        if (mainValue !== mainOptionKeys.CUSTOM_RANGE) {
            return true;
        }

        if (!fromValue && !toValue) {
            return false;
        }

        const parseResultFrom = fromValue ? parseDate(fromValue) : { isValid: true, moment: null };
        const parseResultTo = toValue ? parseDate(toValue) : { isValid: true, moment: null };

        if (!(parseResultFrom.isValid && parseResultTo.isValid)) {
            return false;
        }

        return !(
            parseResultFrom.momentDate &&
            parseResultTo.momentDate &&
            parseResultFrom.momentDate.isAfter(parseResultTo.momentDate)
        );
    }

    static isFromAfterTo(valueFrom: string, valueTo: string) {
        const momentFrom = parseDate(valueFrom).momentDate;
        const momentTo = parseDate(valueTo).momentDate;
        // $FlowFixMe[incompatible-use] automated comment
        // $FlowFixMe[incompatible-call] automated comment
        return momentFrom.isAfter(momentTo);
    }

    toD2DateTextFieldInstance: any;
    constructor(props: Props) {
        super(props);
        this.state = { submitAttempted: false };
    }
    static errorMessages = {
        CUSTOM_RANGE_WITHOUT_VALUES: 'Please specify a range',
        FROM_GREATER_THAN_TO: 'The From date can\'t be after the To date',
        // $FlowFixMe[prop-missing] automated comment
        [elementTypes.DATE]: 'Please provide a valid date',
    };

    static validatorForTypes = {
        // $FlowFixMe[prop-missing] automated comment
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
        return !values || DateFilter.isFilterValid(values.main, values.from, values.to);
    }

    getUpdatedValue(valuePart: {[key: string]: string}) {
        // $FlowFixMe[cannot-spread-indexer] automated comment
        const valueObject = {
            ...this.props.value,
            ...valuePart,
        };

        if (valueObject.from || valueObject.to) {
            valueObject.main = mainOptionKeys.CUSTOM_RANGE;
        } else if (valueObject.main === mainOptionKeys.CUSTOM_RANGE) {
            // $FlowFixMe[incompatible-type] automated comment
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

        if (values && !DateFilter.isFilterValid(values.main, values.from, values.to)) {
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

    // eslint-disable-next-line complexity
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
                        {/* $FlowFixMe[prop-missing] automated comment */}
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
                        {/* $FlowFixMe[prop-missing] automated comment */}
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
