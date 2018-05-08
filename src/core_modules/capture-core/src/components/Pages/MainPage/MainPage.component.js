// @flow
/**
 * @namespace MainPage
*/
import React, { Component } from 'react';
import withSelectionsUpdater from './withSelectionsUpdater';

import EventsList from './EventsList/EventsList.container';

type Props = {
    prerequisitesForWorkingListMet: boolean,
};

class MainPage extends Component<Props> {
    render() {
        const { prerequisitesForWorkingListMet } = this.props;

        return (
            <div>
                {'{{main menu}}'}
                {
                    (() => {
                        if (!prerequisitesForWorkingListMet) {
                            return null;
                        }

                        return (
                            <EventsList
                                {...this.props}
                            />
                        );
                    })()
                }
            </div>
        );
    }
}

export default withSelectionsUpdater()(MainPage);
