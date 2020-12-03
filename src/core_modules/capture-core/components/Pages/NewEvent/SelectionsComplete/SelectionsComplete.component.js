// @flow
import React, { Component } from 'react';
import { NewEventDataEntryWrapper } from '../DataEntryWrapper/NewEventDataEntryWrapper.container';
import NewRelationshipWrapper from '../NewRelationshipWrapper/NewEventNewRelationshipWrapper.container';
import SelectionsNoAccess from '../SelectionsNoAccess/dataEntrySelectionsNoAccess.container';

type Props = {
    showAddRelationship: boolean,
    classes: {
        container: string,
    },
    eventAccess: {
        read: boolean,
        write: boolean,
    },
};

class SelectionsComplete extends Component<Props> {
    render() {
        const { showAddRelationship, eventAccess } = this.props;
        if (!eventAccess.write) {
            return (
                <SelectionsNoAccess />
            );
        }

        return (
            <>
                {showAddRelationship ?
                    <NewRelationshipWrapper /> :
                    <NewEventDataEntryWrapper />
                }
            </>
        );
    }
}

export default SelectionsComplete;
