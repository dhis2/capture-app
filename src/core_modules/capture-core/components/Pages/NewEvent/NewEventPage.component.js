// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import DataEntrySelectionsComplete from './SelectionsComplete/SelectionsComplete.container';
import { DataEntrySelectionsIncomplete } from './SelectionsIncomplete/DataEntrySelectionsIncomplete.container';
import { TrackerProgramHandler } from '../../TrackerProgramHandler';
import { LockedSelector } from '../../LockedSelector/LockedSelector.container';

const getStyles = () => ({});

type Props = {
  isSelectionsComplete: boolean,
  isUserInteractionInProgress: boolean,
};

class Index extends React.Component<Props> {
  renderContents() {
    const { isSelectionsComplete } = this.props;
    if (!isSelectionsComplete) {
      return <DataEntrySelectionsIncomplete />;
    }

    return (
      <TrackerProgramHandler>
        <DataEntrySelectionsComplete />
      </TrackerProgramHandler>
    );
  }

  render() {
    const { isUserInteractionInProgress } = this.props;
    return (
      <div>
        <LockedSelector isUserInteractionInProgress={isUserInteractionInProgress} />
        {this.renderContents()}
      </div>
    );
  }
}

export const NewEventPageComponent = withStyles(getStyles)(Index);
