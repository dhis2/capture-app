// @flow
import React, { Component } from 'react';
import withLoadHandler from './withLoadHandler';
import DataEntryWrapper from './DataEntry/DataEntryWrapper.container';
import QuickSelector from '../../QuickSelector/QuickSelector.container';

type Props = {

};

class NewEvent extends Component<Props> {
    render() {
        return (
            <div>
                <QuickSelector clearOnStartAgain={false} />
                <DataEntryWrapper />
            </div>
        );
    }
}

export default withLoadHandler()(NewEvent);
