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
import type { Props, Value } from './DateTime.types';

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

    const handleBlur = (newValue: Value, otherFieldHasValue: any) => {
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

    const handleDateBlur = (dateValue: string, options: any | null | undefined) => {
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
            <div className={defaultClasses.inputContainer}>
                <DateTimeDate
                    value={currentValue.date}
                    onChange={handleDateChange}
                    onBlur={handleDateBlur}
                    label={dateLabel}
                    classes={classes}
                    innerMessage={innerMessage}
                    {...passOnProps as any}
                />
                {innerMessage?.message?.dateError && (
                    <div className={classes?.innerInputError}>
                        {innerMessage.message.dateError}
                    </div>
                )}
            </div>
            <div className={defaultClasses.inputContainer}>
                <DateTimeTime
                    value={currentValue.time}
                    onChange={handleTimeChange}
                    onBlur={handleTimeBlur}
                    label={timeLabel}
                    classes={classes}
                    innerMessage={innerMessage}
                    {...passOnProps as any}
                />
                {innerMessage?.message?.timeError && (
                    <div className={classes?.innerInputError}>
                        {innerMessage.message.timeError}
                    </div>
                )}
            </div>
            {renderClearButton()}
        </div>
    );
};

export const DateTimeField = withStyles({})(DateTimeFieldPlain);
