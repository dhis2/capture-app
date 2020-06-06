// @flow
import React from 'react';
import { connect } from 'react-redux';
import ViewEventSelector from './ViewEventSelector/ViewEventSelector.component';
import dataEntryHasChanges from '../../DataEntry/common/dataEntryHasChanges';
import { LockedSelector } from '../components/LockedSelector/container';

const mapStateToProps = (state: ReduxState) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    const formHasChanges =
        state.currentSelections.complete &&
        eventDetailsSection.showEditEvent &&
        dataEntryHasChanges(state, 'singleEvent-editEvent');
    return {
        formInputInProgress: formHasChanges,
        showAddRelationship: state.viewEventPage.showAddRelationship,
    };
};

const Page = connect(mapStateToProps)(ViewEventSelector);


export const ViewEventPage = () => <LockedSelector render={() => <Page />} />;
