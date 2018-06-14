// @flow
import React, { Component } from 'react';
import EditEventDataEntry from './DataEntry/EditEventDataEntry.container';
import QuickSelector from '../../QuickSelector/QuickSelector.container';

type Props = {

};
class EditEvent extends Component<Props> {
    render() {
        return (
            <div>
                <QuickSelector clearOnStartAgain={false} />
                <EditEventDataEntry />
            </div>
        );
    }
}

export default EditEvent;
