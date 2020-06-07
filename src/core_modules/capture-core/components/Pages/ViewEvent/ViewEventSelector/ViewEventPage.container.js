// @flow
import React from 'react';
import { connect } from 'react-redux';
import ViewEventSelector from './ViewEventPage.component';
import dataEntryHasChanges from '../../../DataEntry/common/dataEntryHasChanges';

const mapStateToProps = (state: ReduxState) => {
    const eventDetailsSection = state.viewEventPage.eventDetailsSection || {};
    const formHasChanges =
        state.currentSelections.complete &&
        eventDetailsSection.showEditEvent &&
        dataEntryHasChanges(state, 'singleEvent-editEvent');
    return {
        formInputInProgess: formHasChanges,
        showAddRelationship: state.viewEventPage.showAddRelationship,
    };
};

export const ViewEventPageContainer = connect(mapStateToProps)(ViewEventSelector);

