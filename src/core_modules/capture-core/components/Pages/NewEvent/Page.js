// @flow
import React from 'react';
import { connect } from 'react-redux';
import IsSelectionsCompleteLevel from './IsSelectionsCompleteLevel/IsSelectionsCompleteLevel.container';
import { LockedSelector } from '../components/LockedSelector/container';
import dataEntryHasChanges from '../../DataEntry/common/dataEntryHasChanges';

const mapStateToProps = (state: ReduxState) => {
    const formInputInProgess = state.currentSelections.complete && dataEntryHasChanges(state, 'singleEvent-newEvent');
    const inAddRelationship = state.newEventPage.showAddRelationship;
    return {
        formInputInProgess,
        inAddRelationship,
    };
};

const NewEvent = ({ formInputInProgess, inAddRelationship }) => (
    <div>
        <LockedSelector formInputInProgess={formInputInProgess} inAddRelationship={inAddRelationship} />
        <IsSelectionsCompleteLevel />
    </div>
);

export const NewEventPage = connect(mapStateToProps)(NewEvent);
