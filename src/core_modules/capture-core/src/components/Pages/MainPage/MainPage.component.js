// @flow
import React, { Component } from 'react';
import withSelectionsUpdater from './withSelectionsUpdater';

import EventsList from './EventsList/EventsList.container';

type Props = {
    programId: ?string,
    orgUnitId: ?string,
};

class MainPage extends Component<Props> {
    render() {
        const { programId, orgUnitId } = this.props;

        return (
            <div>
                main menu
                {
                    (() => {
                        if (!(programId && orgUnitId)) {
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
