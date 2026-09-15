import React, { useState, useRef, useCallback } from 'react';
import { IconButton } from 'capture-ui';
import { IconCross24 } from '@dhis2/ui';
import { cx } from '@emotion/css';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { orientations } from '../../constants/orientations.const';
import { DateTimeDate } from '../../internal/DateTimeInput/DateTimeDate.component';
import { DateTimeTime } from '../../internal/DateTimeInput/DateTimeTime.component';
import defaultClasses from './dateTime.module.css';
import type { Props, Value } from './DateTime.types';

const DateTimeFieldPlain = (props: Props & WithStyles<any>) => {
    const {
        onBlur,
        onChange,
        value,
        orientation,
        classes,
        innerMessage,
        disabled,
        ...passOnProps
    } = props;

    const dateLabel = passOnProps.dateFormat?.toLowerCase() || 'yyyy-mm-dd';
    const timeLabel = 'hh:mm';

    const [dateError, setDateError] = useState({ error: null, errorCode: null });
    const dateTouched = useRef(false);
    const timeTouched = useRef(false);

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
        onBlur(null, {}, {});
        event.currentTarget.blur();
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

    const handleBlur = (newValue: Value, extraErrorInfo?: { error?: any; errorCode?: any }) => {
        const bothTouched = dateTouched.current && timeTouched.current;
        const bothHaveValues = !!newValue.date && !!newValue.time;
        const touched = bothTouched && bothHaveValues;

        if (!newValue.date && !newValue.time) {
            onBlur(undefined, { touched }, {});
            return;
        }

        onBlur(
            newValue,
            {
                touched,
                error: extraErrorInfo?.error,
                errorCode: extraErrorInfo?.errorCode,
            },
            {},
        );
    };

    const handleTimeBlur = (timeValue: string) => {
        timeTouched.current = true;
        const currentValue = value || {};
        handleBlur(
            { time: timeValue, date: currentValue.date },
            { error: dateError.error, errorCode: dateError.errorCode },
        );
    };

    const handleDateBlur = (dateValue: string, options?: any) => {
        dateTouched.current = true;
        setDateError({
            error: options?.error,
            errorCode: options?.errorCode,
        });

        const currentValue = value || {};
        handleBlur(
            { time: currentValue.time, date: dateValue },
            { error: options?.error, errorCode: options?.errorCode },
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
            className={cx(defaultClasses.fieldsContainer, {
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

const styles = (theme: any) => ({
    innerInputError: {
        color: theme.palette.error.main,
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
});

export const DateTimeField = withStyles(styles)(DateTimeFieldPlain);
