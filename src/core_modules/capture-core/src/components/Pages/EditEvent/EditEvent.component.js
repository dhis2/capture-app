// @flow
import React, { Component } from 'react';
import EditEventDataEntry from './DataEntry/EditEventDataEntry.container';

type Props = {

};
class EditEvent extends Component<Props> {
    render() {
        return (
            <div>
                <EditEventDataEntry />
            </div>
        );
    }
}

export default EditEvent;
