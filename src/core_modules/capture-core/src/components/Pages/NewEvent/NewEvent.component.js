// @flow
import React, { Component } from 'react';
import withInputHandling from './withInputHandling';

type Props = {

};

class NewEvent extends Component<Props> {
    render() {
        return (
            <div>
               newEvent
            </div>
        );
    }
}

export default withInputHandling()(NewEvent);
