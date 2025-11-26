import * as React from 'react';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
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
    onOpenMap?: (hasValue: boolean) => void,
}

class PolygonFieldPlain extends React.Component<Props & WithStyles<typeof getStyles>> {
    dialogClasses: any;
    passOnClasses: any;
    constructor(props: Props & WithStyles<typeof getStyles>) {
        super(props);

        const { dialogPaper, ...passOnClasses } = props.classes;
        this.passOnClasses = passOnClasses;
        this.dialogClasses = {
            paper: props.classes.dialogPaper,
        };
    }

    render() {
        const { classes, dialogLabel, onOpenMap, ...passOnProps } = this.props;
        return (
            <UIPolygonField
                mapDialog={
                    <Modal
                        className={this.dialogClasses.dialogPaper}
                        large
                    >
                        <ModalTitle key="title">{dialogLabel}</ModalTitle>
                    </Modal>
                }
                onOpenMap={onOpenMap || (() => undefined)}
                {...passOnProps}
            />
        );
    }
}

export const PolygonField = withStyles(getStyles)(withCenterPoint()(PolygonFieldPlain));
