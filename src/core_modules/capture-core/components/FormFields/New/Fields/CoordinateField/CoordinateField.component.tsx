import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { CoordinateField as UICoordinateField } from 'capture-ui';
import { Modal, ModalTitle } from '@dhis2/ui';
import { orientations } from '../../../New';
import { withCenterPoint } from '../../HOC';

const getStyles = (theme: any) => ({
    inputWrapperFocused: {
        position: 'relative' as const,
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
    value?: any | null,
    onBlur: (value: any) => void,
    orientation: typeof orientations[keyof typeof orientations],
    dialogLabel: string,
}

class CoordinateFieldPlain extends React.Component<Props & WithStyles<typeof getStyles>> {
    constructor(props) {
        super(props);

        const { dialogPaper, ...passOnClasses } = props.classes;
        this.passOnClasses = passOnClasses;
        this.dialogClasses = {
            paper: props.classes.dialogPaper,
        };
    }
    dialogClasses: any;
    passOnClasses: any;

    render() {
        const { classes, dialogLabel, ...passOnProps } = this.props;

        return (
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
