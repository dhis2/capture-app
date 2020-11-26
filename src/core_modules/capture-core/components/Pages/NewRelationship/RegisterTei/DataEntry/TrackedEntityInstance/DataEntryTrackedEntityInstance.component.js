// @flow
import React, { Component } from 'react';
import { withTheme } from '@material-ui/core/styles';
import type { RenderFoundation, TeiRegistration } from '../../../../../../metaData';
import ConfiguredTei from './ConfiguredTei.component';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import teiClasses from './trackedEntityInstance.module.css';

type Props = {
    teiRegistrationMetadata: ?TeiRegistration,
    onSave: (dataEntryId: string, itemId: string, formFoundation: RenderFoundation) => void,
    onCancel: () => void,
    classes: {
        fieldLabelMediaBased: string,
    },
    theme: Theme,
};

class RelationshipTrackedEntityInstance extends Component<Props> {
    fieldOptions: { theme: Theme };

    constructor(props: Props) {
        super(props);
        this.fieldOptions = {
            theme: props.theme,
            fieldLabelMediaBasedClass: teiClasses.fieldLabelMediaBased,
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
            ...passOnProps
        } = this.props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <ConfiguredTei
                id={DATA_ENTRY_ID}
                onSave={this.handleSave}
                fieldOptions={this.fieldOptions}
                {...passOnProps}
            />
        );
    }
}

export default withTheme()(RelationshipTrackedEntityInstance);
