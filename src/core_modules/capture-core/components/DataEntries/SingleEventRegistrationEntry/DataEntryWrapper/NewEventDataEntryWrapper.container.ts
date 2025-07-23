// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { NewEventDataEntryWrapperComponent } from './NewEventDataEntryWrapper.component';
import {
    setNewEventFormLayoutDirection,
} from './newEventDataEntryWrapper.actions';
import { getDataEntryHasChanges } from '../getNewEventDataEntryHasChanges';
import type { ContainerProps, StateProps, MapStateToProps } from './NewEventDataEntryWrapper.types';

const makeMapStateToProps = (): MapStateToProps => (state: any): StateProps => ({
    dataEntryHasChanges: getDataEntryHasChanges(state),
    formHorizontal: !!state.newEventPage.formHorizontal,
});

const mapDispatchToProps = (dispatch: any) => ({
    onFormLayoutDirectionChange: (formHorizontal: boolean) => {
        dispatch(setNewEventFormLayoutDirection(formHorizontal));
    },
});

export const NewEventDataEntryWrapper: ComponentType<ContainerProps> =
    connect(makeMapStateToProps, mapDispatchToProps)(NewEventDataEntryWrapperComponent);
