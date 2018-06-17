// @flow
/**
 * @namespace MainPage
*/
import React, { Component } from 'react';

import withLoadHandler from './withLoadHandler';
import EventsListConnectivityWrapper from './EventsListConnectionWrapper/EventsListConnectivityWrapper.container';
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
                            <EventsListConnectivityWrapper />
                        );
                    })()
                }
            </div>
        );
    }
}

export default (MainPage);
