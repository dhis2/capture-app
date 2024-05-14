// @flow
import { connect, useDispatch, useSelector } from 'react-redux';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { compose } from 'redux';
import { batchActions } from 'redux-batched-actions';
import { SingleEventRegistrationEntryComponent } from './SingleEventRegistrationEntry.component';
import { withBrowserBackWarning } from '../../../HOC/withBrowserBackWarning';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { makeEventAccessSelector } from './SingleEventRegistrationEntry.selectors';
import { withLoadingIndicator } from '../../../HOC';
import { defaultDialogProps as dialogConfig } from '../../Dialogs/DiscardDialog.constants';
import { getOpenDataEntryActions } from './DataEntryWrapper/DataEntry';
import type { ContainerProps, StateProps, MapStateToProps } from './SingleEventRegistrationEntry.types';
import { useCategoryCombinations } from '../../DataEntryDhis2Helpers/AOC/useCategoryCombinations';

const inEffect = (state: ReduxState) => dataEntryHasChanges(state, 'singleEvent-newEvent') || state.newEventPage.showAddRelationship;

const makeMapStateToProps = (): MapStateToProps => {
    const eventAccessSelector = makeEventAccessSelector();
    return (state: ReduxState, { id }: ContainerProps): StateProps => ({
        ready: state.dataEntries[id],
        showAddRelationship: !!state.newEventPage.showAddRelationship,
        eventAccess: eventAccessSelector(state),
    });
};

const mapDispatchToProps = () => ({});

const mergeProps = (stateProps: StateProps): StateProps => (stateProps);

const openSingleEventDataEntry = (InnerComponent: React.ComponentType<ContainerProps>) => (
    (props: ContainerProps) => {
        const hasRun = useRef<boolean>(false);
        const { selectedScopeId } = props;
        const dispatch = useDispatch();
        const selectedCategories = useSelector((state: ReduxState) => state.currentSelections.categories);
        const { isLoading, programCategory } = useCategoryCombinations(selectedScopeId);

        useEffect(() => {
            if (!isLoading && !hasRun.current) {
                dispatch(
                    batchActions([
                        ...getOpenDataEntryActions(programCategory, selectedCategories),
                    ]),
                );
                hasRun.current = true;
            }
        }, [selectedCategories, dispatch, isLoading, programCategory]);

        return (
            <InnerComponent
                {...props}
            />
        );
    });

export const SingleEventRegistrationEntry: React.ComponentType<ContainerProps> =
    compose(
        openSingleEventDataEntry,
        connect<
            StateProps,
            ContainerProps,
            StateProps,
            *,
            ReduxState,
            *,
        >(makeMapStateToProps, mapDispatchToProps, mergeProps),
        withLoadingIndicator(),
        withBrowserBackWarning(dialogConfig, inEffect),
    )(SingleEventRegistrationEntryComponent);
