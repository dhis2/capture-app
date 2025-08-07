import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { PolygonField as UIPolygonField } from 'capture-ui';
import { Modal, ModalTitle } from '@dhis2/ui';
import { orientations } from '../../../New';
import { withCenterPoint } from '../../HOC';

const getStyles = () => ({
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

class PolygonFieldPlain extends React.Component<Props & WithStyles<typeof getStyles>> {
    constructor(props: Props & WithStyles<typeof getStyles>) {
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
            <UIPolygonField
                mapDialog={
                    <Modal
                        className={this.dialogClasses}
                        large
                    >
                        <ModalTitle key="title">{dialogLabel}</ModalTitle>
                    </Modal>
                }
                {...passOnProps}
            />
        );
    }
}

export const PolygonField = withStyles(getStyles)(withCenterPoint()(PolygonFieldPlain));
