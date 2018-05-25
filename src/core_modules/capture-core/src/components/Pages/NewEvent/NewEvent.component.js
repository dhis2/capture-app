// @flow
import React, { Component } from 'react';
import withLoadHandler from './withLoadHandler';
import DataEntrySelectionsCompleteHandler from './DataEntry/DataEntrySelectionsCompleteHandler.container';

type Props = {

};

class NewEvent extends Component<Props> {
    render() {
        return (
            <div>
                <DataEntrySelectionsCompleteHandler />
            </div>
        );
    }
}

export default withLoadHandler()(NewEvent);
