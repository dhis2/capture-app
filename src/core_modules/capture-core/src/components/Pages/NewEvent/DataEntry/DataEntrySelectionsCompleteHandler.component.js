// @flow
import React from 'react';
import NewEventDataEntry from './NewEventDataEntry.container';

type Props = {
    isSelectionsComplete: boolean,
};

export default (props: Props) => {
    const { isSelectionsComplete } = props;

    if (!isSelectionsComplete) {
        return (
            <div>
                selections not complete
            </div>
        );
    }

    return (
        <NewEventDataEntry />
    );
};