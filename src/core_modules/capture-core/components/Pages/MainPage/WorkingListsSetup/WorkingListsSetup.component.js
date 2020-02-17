// @flow
import * as React from 'react';
import { WorkingLists } from '../WorkingLists';

type PassOnProps = {|
    skipReload: boolean,
|};

type Props = {|
    ...PassOnProps,
|};

const WorkingListsSetup = (props: Props) => {
    const { ...passOnProps } = props;
    return (
        <WorkingLists
            {...passOnProps}
            listId="eventList"
        />
    );
};

export default WorkingListsSetup;
