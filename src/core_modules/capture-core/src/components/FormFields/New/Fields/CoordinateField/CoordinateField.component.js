// @flow
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { CoordinateField as UICoordinateField } from 'capture-ui';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { orientations } from '../../../New';

const getStyles = (theme: Theme) => ({
    inputWrapperFocused: {
        position: 'relative',
        boxShadow: `0px 0px 0px 2px ${theme.palette.primary.light}`,
        zIndex: 10,
        margin: '2px 0px 2px 0px',
    },
    inputWrapperUnfocused: {
        margin: '2px 0px 2px 0px',
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
    mapIconContainer: {
        fill: theme.palette.primary.dark,
    },
    dialogPaper: {
        maxWidth: 'none',
        width: '75%',
        height: '75%',
    },
});

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
    orientation: $Values<typeof orientations>,
    dialogLabel: string,
}

class CoordinateField extends React.Component<Props> {
    dialogClasses: Object;
    passOnClasses: Object;

    constructor(props) {
        super(props);

        const { dialogPaper, ...passOnClasses } = props.classes;
        this.passOnClasses = passOnClasses;
        this.dialogClasses = {
            paper: props.classes.dialogPaper,
        };
    }

    render() {
        const { classes, dialogLabel, ...passOnProps } = this.props;

        return (
            <UICoordinateField
                mapDialog={
                    <Dialog
                        classes={this.dialogClasses}
                    >
                        <DialogTitle key="title">{dialogLabel}</DialogTitle>
                    </Dialog>
                }
                {...passOnProps}
                classes={this.passOnClasses}
            />
        );
    }
}

export default withStyles(getStyles)(CoordinateField);
