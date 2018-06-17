// @flow
import React, { Component } from 'react';
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

export default (NewEvent);
