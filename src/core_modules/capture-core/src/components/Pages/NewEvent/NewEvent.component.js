// @flow
import React, { Component } from 'react';
import withLoadHandler from './withLoadHandler';
import NewEventDataEntry from './DataEntry/NewEventDataEntry.container';

type Props = {

};

class NewEvent extends Component<Props> {
    render() {
        return (
            <div>
                <NewEventDataEntry />
            </div>
        );
    }
}

export default withLoadHandler()(NewEvent);
