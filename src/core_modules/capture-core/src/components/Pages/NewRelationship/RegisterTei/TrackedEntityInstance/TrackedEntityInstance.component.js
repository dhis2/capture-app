// @flow
import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { RenderFoundation, TeiRegistration } from '../../../../../metaData';
import ConfiguredTei from './ConfiguredTei.component';
import { DATA_ENTRY_ID } from '../registerTei.const';

const getStyles = theme => ({
    fieldLabelMediaBased: {
        [theme.breakpoints.down(523)]: {
            paddingTop: '0px !important',
        },
    },
});

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
            ...passOnProps
        } = this.props;
        return (
            <div>
                <ConfiguredTei
                    id={DATA_ENTRY_ID}
                    onSave={this.handleSave}
                    fieldOptions={this.fieldOptions}
                    {...passOnProps}
                />
            </div>
        );
    }
}

// $FlowFixMe
export default withStyles(getStyles)(withTheme()(RelationshipTrackedEntityInstance));
