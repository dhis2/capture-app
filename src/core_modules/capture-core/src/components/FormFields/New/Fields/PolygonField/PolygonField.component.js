// @flow
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { PolygonField as UIPolygonField } from 'capture-ui';

const getStyles = (theme: Theme) => ({
    inputWrapperFocused: {
        border: `2px solid ${theme.palette.accent.dark}`,
        borderRadius: '5px',
    },
    inputWrapperUnfocused: {
        padding: 2,
    },
});

type Props = {
    value?: ?any,
    onBlur: (value: any) => void,
    classes: {
        inputWrapperFocused: string,
        inputWrapperUnfocused: string,
    },
}

const PolygonField = (props: Props) => {
    const { ...passOnProps } = props;
    return (
        <UIPolygonField
            {...passOnProps}
        />
    );
};

export default withStyles(getStyles)(PolygonField);
