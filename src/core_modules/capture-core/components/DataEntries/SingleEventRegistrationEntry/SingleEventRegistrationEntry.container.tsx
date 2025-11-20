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
import { itemId } from './DataEntryWrapper/DataEntry/helpers/constants';
import { useCoreOrgUnit } from '../../../metadataRetrieval/coreOrgUnit';

const inEffect = (state: any) =>
    dataEntryHasChanges(state, 'singleEvent-newEvent') || state.newEventPage.showAddRelationship;

const makeMapStateToProps = (): MapStateToProps => {
    const eventAccessSelector = makeEventAccessSelector();
    return (state: any, { id }: ContainerProps): StateProps => ({
        ready: state.dataEntries[id]?.itemId === itemId,
        showAddRelationship: !!state.newEventPage.showAddRelationship,
        eventAccess: eventAccessSelector(state) || { read: false, write: false },
    });
};

const mapDispatchToProps = () => ({});

const mergeProps = (stateProps: StateProps): StateProps => (stateProps);

const openSingleEventDataEntry = (InnerComponent: React.ComponentType<ContainerProps>) => (
    (props: ContainerProps) => {
        const hasRun = useRef<boolean>(false);
        const { selectedScopeId, orgUnitId } = props;
        const { orgUnit } = useCoreOrgUnit(orgUnitId);
        const dispatch = useDispatch();
        const selectedCategories = useSelector((state: any) => state.currentSelections.categories);
        const { isLoading, programCategory } = useCategoryCombinations(selectedScopeId);

        useEffect(() => {
            if (!isLoading && !hasRun.current) {
                dispatch(
                    batchActions([
                        ...getOpenDataEntryActions(orgUnit, programCategory, selectedCategories),
                    ]),
                );
                hasRun.current = true;
            }
        }, [selectedCategories, dispatch, isLoading, programCategory, orgUnit]);

        return (
            <InnerComponent
                {...props}
            />
        );
    });

export const SingleEventRegistrationEntry: React.ComponentType<ContainerProps> =
    compose(
        openSingleEventDataEntry,
        connect(makeMapStateToProps, mapDispatchToProps, mergeProps),
        withLoadingIndicator(),
        withBrowserBackWarning(dialogConfig, inEffect),
    )(SingleEventRegistrationEntryComponent) as React.ComponentType<ContainerProps>;
