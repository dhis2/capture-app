// @flow
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { CoordinateField as UICoordinateField } from 'capture-ui';
import { Modal, ModalTitle } from '@dhis2/ui';
import { typeof orientations } from '../../../New';
import { withCenterPoint } from '../../HOC';

const getStyles = (theme: Theme) => ({
    inputWrapperFocused: {
        position: 'relative',
        zIndex: 10,
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
    mapIconContainerDisabled: {
        fill: 'rgba(0,0,0,0.30)',
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
    orientation: $Values<orientations>,
    dialogLabel: string,
}

class CoordinateFieldPlain extends React.Component<Props> {
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
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <UICoordinateField
                mapDialog={
                    <Modal
                        className={this.dialogClasses}
                        large
                    >
                        <ModalTitle>{dialogLabel}</ModalTitle>
                    </Modal>
                }
                {...passOnProps}
                classes={this.passOnClasses}
            />
        );
    }
}

export const CoordinateField = withStyles(getStyles)(withCenterPoint()(CoordinateFieldPlain));
