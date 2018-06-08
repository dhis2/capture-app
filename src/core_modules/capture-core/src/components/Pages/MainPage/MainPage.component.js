// @flow
/**
 * @namespace MainPage
*/
import React, { Component } from 'react';
import QuickSelector from 'capture-core/components/QuickSelector/QuickSelector.container';
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
                <QuickSelector />
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
// Disabled routing for testing
// export default withSelectionsUpdater()(MainPage);
export default MainPage;
