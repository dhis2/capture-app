// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { NewEventDataEntryWrapperComponent } from './NewEventDataEntryWrapper.component';
import {
    setNewEventFormLayoutDirection,
} from './newEventDataEntryWrapper.actions';
import {
    makeStageSelector,
} from './newEventDataEntryWrapper.selectors';
import { getDataEntryHasChanges } from '../getNewEventDataEntryHasChanges';
import type { Props, ContainerProps, StateProps, MapStateToProps } from './NewEventDataEntryWrapper.types';

const makeMapStateToProps = (): MapStateToProps => {
    const stageSelector = makeStageSelector();

    return (state: ReduxState): StateProps => {
        const stage = stageSelector(state);
        const formFoundation = stage && stage.stageForm ? stage.stageForm : null;
        return ({
            stage,
            formFoundation,
            dataEntryHasChanges: getDataEntryHasChanges(state),
            formHorizontal: (formFoundation && formFoundation.customForm ? false : !!state.newEventPage.formHorizontal),
        });
    };
};

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
