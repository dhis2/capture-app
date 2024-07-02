// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { NewEventDataEntryWrapperComponent } from './NewEventDataEntryWrapper.component';
import {
    setNewEventFormLayoutDirection,
} from './newEventDataEntryWrapper.actions';
import { getDataEntryHasChanges } from '../getNewEventDataEntryHasChanges';
import type { Props, ContainerProps, StateProps, MapStateToProps } from './NewEventDataEntryWrapper.types';

const makeMapStateToProps = (): MapStateToProps => (state: ReduxState): StateProps => ({
    dataEntryHasChanges: getDataEntryHasChanges(state),
    formHorizontal: !!state.newEventPage.formHorizontal,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onFormLayoutDirectionChange: (formHorizontal: boolean) => {
        dispatch(setNewEventFormLayoutDirection(formHorizontal));
    },
});

export const NewEventDataEntryWrapper: ComponentType<ContainerProps> =
    connect<
        Props,
        ContainerProps,
        StateProps,
        *,
        ReduxState,
        *,
    >(makeMapStateToProps, mapDispatchToProps)(NewEventDataEntryWrapperComponent);
