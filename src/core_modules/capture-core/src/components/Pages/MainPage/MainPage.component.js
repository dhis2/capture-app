// @flow
/**
 * @namespace MainPage
*/
import React, { Component } from 'react';

import EventsList from './EventsList/EventsList.container';

type Props = {
    currentSelectionsComplete: boolean,
};

class MainPage extends Component<Props> {
    render() {
        const { currentSelectionsComplete } = this.props;

        return (
            <div>
                {
                    (() => {
                        if (!currentSelectionsComplete) {
                            return null;
                        }

                        return (
                            <EventsList />
                        );
                    })()
                }
            </div>
        );
    }
}

export default (MainPage);
