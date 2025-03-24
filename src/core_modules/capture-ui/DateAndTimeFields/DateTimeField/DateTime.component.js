// @flow
import React, { useState, useRef, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconButton } from 'capture-ui';
import { IconCross24 } from '@dhis2/ui';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { orientations } from '../../constants/orientations.const';
import { DateTimeDate } from '../../internal/DateTimeInput/DateTimeDate.component';
import { DateTimeTime } from '../../internal/DateTimeInput/DateTimeTime.component';
import defaultClasses from './dateTime.module.css';

type Value = {
    date?: ?string,
    time?: ?string,
};

type Props = {
    onBlur: (value: ?Value, options: Object, internalError: Object) => void,
    onChange: (value: ?Value) => void,
    value: Value,
    orientation: $Values<typeof orientations>,
    classes: Object,
    dateLabel?: string,
    timeLabel?: string,
    innerMessage: Object,
    locale?: string,
    shrinkDisabled: boolean,
    disabled: boolean,
};

const DateTimeFieldPlain = (props: Props) => {
    const {
        onBlur,
        onChange,
        value,
        orientation,
        classes,
        dateLabel = i18n.t('Date'),
        timeLabel = i18n.t('Time'),
        innerMessage,
        disabled,
        ...passOnProps
    } = props;

    const [dateError, setDateError] = useState({ error: null, errorCode: null });
    const touchedFields = useRef(new Set());

    const handleClear = () => {
        onBlur(null, {}, {});
    };

    const handleTimeChange = useCallback((timeValue: string) => {
        const currentValue = value || {};
        onChange({
            time: timeValue,
            date: currentValue.date,
        });
    }, [onChange, value]);

    const handleDateChange = useCallback((dateValue: string) => {
        const currentValue = value || {};
        onChange({
            time: currentValue.time,
            date: dateValue,
        });
    }, [onChange, value]);

    const handleBlur = (newValue: Value, otherFieldHasValue: Object) => {
        const touched = touchedFields.current.size === 2;

        if (!newValue.date && !newValue.time) {
            onBlur(undefined, { touched }, {});
            return;
        }

        onBlur(
            newValue,
            {
                touched: touched || otherFieldHasValue.touched,
                error: otherFieldHasValue?.error,
                errorCode: otherFieldHasValue?.errorCode,
            },
            {},
        );
    };

    const handleTimeBlur = (timeValue: string) => {
        touchedFields.current.add('timeTouched');
        const currentValue = value || {};
        handleBlur(
            { time: timeValue, date: currentValue.date },
            {
                touched: !!currentValue.date,
                error: dateError.error,
                errorCode: dateError.errorCode,
            },
        );
    };

    const handleDateBlur = (dateValue: string, options: ?Object) => {
        touchedFields.current.add('dateTouched');
        setDateError({
            error: options?.error,
            errorCode: options?.errorCode,
        });

        const currentValue = value || {};
        handleBlur(
            { time: currentValue.time, date: dateValue },
            {
                touched: !!currentValue.time,
                error: options?.error,
                errorCode: options?.errorCode,
            },
        );
    };

    const renderClearButton = () => (
        <IconButton
            className={defaultClasses.clearButton}
            disabled={!!disabled}
            onClick={handleClear}
        >
            <IconCross24 />
        </IconButton>
    );

    const isVertical = orientation === orientations.VERTICAL;
    const currentValue = value || {};

    return (
        <div
            className={classNames(defaultClasses.fieldsContainer, {
                [defaultClasses.fieldsContainerVertical]: isVertical,
            })}
        >
            {isVertical && renderClearButton()}
            <div className={defaultClasses.inputContainer}>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <DateTimeDate
                    value={currentValue.date}
                    onChange={handleDateChange}
                    onBlur={handleDateBlur}
                    label={dateLabel}
                    classes={classes}
                    innerMessage={innerMessage}
                    {...passOnProps}
                />
                {innerMessage?.message?.dateError && (
                    <div className={classes?.innerInputError}>
                        {innerMessage.message.dateError}
                    </div>
                )}
            </div>
            <div className={defaultClasses.inputContainer}>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <DateTimeTime
                    value={currentValue.time}
                    onChange={handleTimeChange}
                    onBlur={handleTimeBlur}
                    label={timeLabel}
                    classes={classes}
                    innerMessage={innerMessage}
                    {...passOnProps}
                />
                {innerMessage?.message?.timeError && (
                    <div className={classes?.innerInputError}>
                        {innerMessage.message.timeError}
                    </div>
                )}
            </div>
            {!isVertical && renderClearButton()}
        </div>
    );
};

export const DateTimeField = withStyles()(DateTimeFieldPlain);
