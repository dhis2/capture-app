// @flow
/**
 * @namespace MainPage
 */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import EventsListConnectivityWrapper from './EventsListConnectivityWrapper/EventsListConnectivityWrapper.container';
import { TrackerProgramHandler } from '../../TrackerProgramHandler';
import { LockedSelector } from '../../LockedSelector/LockedSelector.container';

const getStyles = () => ({
  listContainer: {
    padding: 24,
  },
});

type Props = {
  currentSelectionsComplete: boolean,
  classes: {
    listContainer: string,
  },
};

class Index extends Component<Props> {
  render() {
    const { currentSelectionsComplete, classes } = this.props;

    return (
      <div>
        <LockedSelector />
        {(() => {
          if (!currentSelectionsComplete) {
            return null;
          }

          return (
            <TrackerProgramHandler>
              <div className={classes.listContainer} data-test="dhis2-capture-event-list-container">
                <EventsListConnectivityWrapper listId="eventList" />
              </div>
            </TrackerProgramHandler>
          );
        })()}
      </div>
    );
  }
}

export const MainPageComponent = withStyles(getStyles)(Index);
