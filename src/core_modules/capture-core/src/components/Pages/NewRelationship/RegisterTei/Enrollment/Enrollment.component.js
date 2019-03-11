// @flow
import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Enrollment, RenderFoundation } from '../../../../../metaData';
import ConfiguredEnrollment from './ConfiguredEnrollment.component';
import { DATA_ENTRY_ID } from '../registerTei.const';

const getStyles = theme => ({
    fieldLabelMediaBased: {
        [theme.breakpoints.down(523)]: {
            paddingTop: '0px !important',
        },
    },
});

type Props = {
    enrollmentMetadata: Enrollment,
    onUpdateField: (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: Object,
    onSave: (dataEntryId: string, itemId: string, formFoundation: RenderFoundation) => void,
    // onAddNote: (itemId: string, dataEntryId: string, note: string) => void,
    onCancel: () => void,
    classes: {
        fieldLabelMediaBased: string,
    },
    theme: Theme,
};

class NewEnrollmentRelationship extends Component<Props> {
    fieldOptions: { theme: Theme };

    constructor(props: Props) {
        super(props);
        this.fieldOptions = {
            theme: props.theme,
            fieldLabelMediaBasedClass: props.classes.fieldLabelMediaBased,
        };
    }

    handleSave = (itemId: string, dataEntryId: string, formFoundation: RenderFoundation) => {
        this.props.onSave(itemId, dataEntryId, formFoundation);
    }

    render() {
        const {
            classes,
            onSave,
            theme,
            enrollmentMetadata,
            ...passOnProps
        } = this.props;
        return (
            <div>
                <ConfiguredEnrollment
                    id={DATA_ENTRY_ID}
                    onSave={this.handleSave}
                    fieldOptions={this.fieldOptions}
                    enrollmentMetadata={enrollmentMetadata}
                    {...passOnProps}
                />
            </div>
        );
    }
}

// $FlowFixMe
export default withStyles(getStyles)(withTheme()(NewEnrollmentRelationship));
