// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';

type Props = {
    trackedEntityType: any,
}

const getStyles = theme => ({

});

class TeiRelationship extends React.Component<Props> {
    findTei = () => {

    }

    createTei = () => {
    }


    render() {
        return (
            <div>
                <div onClick={this.findTei} role="button" tabIndex="0">
                    {i18n.t('Link to an existing {trackedEntityType}')}
                </div>
                <div onClick={this.createTei} role="button" tabIndex="0">
                    {i18n.t('Create new {trackedEntityType}')}
                </div>
            </div>
        );
    }
}

export default withStyles(getStyles)(TeiRelationship);

