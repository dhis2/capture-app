// @flow
import React, { Component } from 'react';
import withLoadHandler from './withLoadHandler';
import DataEntryWrapper from './DataEntry/DataEntryWrapper.container';

type Props = {

};

class NewEvent extends Component<Props> {
    render() {
        return (
            <div>
                <DataEntryWrapper />
            </div>
        );
    }
}

export default withLoadHandler()(NewEvent);
