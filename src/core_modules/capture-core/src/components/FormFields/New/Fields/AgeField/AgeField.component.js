// @flow
import * as React from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { AgeField as UIAgeField } from 'capture-ui';
import withCalendarProps from '../../HOC/withCalendarProps';
import moment from '../../../../../utils/moment/momentResolver';
import parseDate from '../../../../../utils/parsers/date.parser';

const getStyles = (theme: Theme) => ({
    inputWrapperFocused: {
        border: `2px solid ${theme.palette.primary.light}`,
        borderRadius: '5px',
    },
    inputWrapperUnfocused: {
        padding: 2,
    },
    innerInputError: {
        color: theme.palette.error.main,
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputWarning: {
        color: theme.palette.warning.dark,
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputInfo: {
        color: 'green',
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
    innerInputValidating: {
        color: 'orange',
        padding: theme.typography.pxToRem(3),
        fontSize: theme.typography.pxToRem(12),
    },
});

const parseDateOuter = (dateValue: ?string) => parseDate(dateValue || '');

type Props = {
    value?: ?any,
    onBlur: (value: any) => void,
    classes: {
        inputWrapperFocused: string,
        inputWrapperUnfocused: string,
        innerInputError: string,
        innerInputWarning: string,
        innerInputInfo: string,
        innerInputValidating: string,
    },
    calendarTheme: Object,
    calendarLocale: Object,
    calendarOnConvertValueIn: Function,
    calendarOnConvertValueOut: Function,
}

const AgeField = (props: Props) => {
    const { calendarTheme, calendarLocale, calendarOnConvertValueIn, calendarOnConvertValueOut, ...passOnProps } = props;
    return (
        <UIAgeField
            onParseDate={parseDateOuter}
            moment={moment}
            dateCalendarTheme={calendarTheme}
            dateCalendarLocale={calendarLocale}
            dateCalendarOnConvertValueIn={calendarOnConvertValueIn}
            dateCalendarOnConvertValueOut={calendarOnConvertValueOut}
            {...passOnProps}
        />
    );
};

export default withTheme()(withCalendarProps()(withStyles(getStyles)(AgeField)));
