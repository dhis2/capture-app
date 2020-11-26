// @flow
import React, { Component } from 'react';
import { withTheme } from '@material-ui/core/styles';
import type { Enrollment, RenderFoundation } from '../../../../../../metaData';
import ConfiguredEnrollment from './ConfiguredEnrollment.component';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import enrollmentClasses from './enrollment.module.css';

type Props = {
    enrollmentMetadata: Enrollment,
    onUpdateField: (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: Object,
    onSave: (dataEntryId: string, itemId: string, formFoundation: RenderFoundation) => void,
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
            fieldLabelMediaBasedClass: enrollmentClasses.fieldLabelMediaBased,
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
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <ConfiguredEnrollment
                id={DATA_ENTRY_ID}
                onSave={this.handleSave}
                fieldOptions={this.fieldOptions}
                enrollmentMetadata={enrollmentMetadata}
                {...passOnProps}
            />
        );
    }
}

export default withTheme()(NewEnrollmentRelationship);
