// @flow
import * as React from 'react';
import { withLoadingIndicator } from '../../../../HOC';
import { WorkingListsSetup } from '../WorkingListsSetup';

const WorkingListsSetupWithLoadingIndicator = withLoadingIndicator()(WorkingListsSetup);

type Props = {
  onHold: boolean,
};

const WorkingListsOnHoldWrapper = (props: Props) => {
  const { onHold } = props;
  return <WorkingListsSetupWithLoadingIndicator ready={!onHold} />;
};

export default WorkingListsOnHoldWrapper;
