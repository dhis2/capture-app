// @flow
import { connect, useDispatch, useSelector } from 'react-redux';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { compose } from 'redux';
import { batchActions } from 'redux-batched-actions';
import { EventRegistrationEntryWrapperComponent } from './EventRegistrationEntryWrapper.component';
import { withLoadingIndicator } from '../../HOC/withLoadingIndicator';
import type { ContainerProps, StateProps, ReduxState } from './EventRegistrationEntryWrapper.types';
import { getOpenDataEntryActions } from '../DataEntries/SingleEventRegistrationEntry/DataEntryWrapper/DataEntry';
import { useCategoryCombinations } from '../DataEntryDhis2Helpers/AOC/useCategoryCombinations';
import { makeEventAccessSelector } from './selectors';
import { itemId } from './constants';

const makeMapStateToProps = () => {
    const eventAccessSelector = makeEventAccessSelector();
    return (state: ReduxState, ownProps: ContainerProps): StateProps => ({
        selectedScopeId: ownProps.selectedScopeId,
        dataEntryId: ownProps.dataEntryId,
        orgUnitId: state.currentSelections.orgUnitId,
        ready: state.dataEntries[ownProps.dataEntryId]?.itemId === itemId,
        eventAccess: eventAccessSelector(state),
    });
};

const openSingleEventDataEntry = (InnerComponent: React.ComponentType<any>) => (
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

export const EventRegistrationEntryWrapper = compose(
    openSingleEventDataEntry,
    connect(makeMapStateToProps(), () => ({})),
    withLoadingIndicator(),
)(EventRegistrationEntryWrapperComponent);
