// @flow
import React, { useCallback, type ComponentType, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cleanUpDataEntry } from '../NewPage.actions';
import { NEW_RELATIONSHIP_EVENT_DATA_ENTRY_ID, NEW_SINGLE_EVENT_DATA_ENTRY_ID, NEW_TEI_DATA_ENTRY_ID } from '../NewPage.component';
import {
    startSavingNewTrackedEntityInstance,
    startSavingNewTrackedEntityInstanceWithEnrollment,
} from './RegistrationDataEntry.actions';
import { RegistrationDataEntryComponent } from './RegistrationDataEntry.component';
import type { OwnProps } from './RegistrationDataEntry.types';

export const RegistrationDataEntry: ComponentType<OwnProps>
  = ({ selectedScopeId, dataEntryId, setScopeId }) => {
      const dispatch = useDispatch();

      const dispatchOnSaveWithoutEnrollment = useCallback(
          () => { dispatch(startSavingNewTrackedEntityInstance()); },
          [dispatch]);

      const dispatchOnSaveWithEnrollment = useCallback(
          () => { dispatch(startSavingNewTrackedEntityInstanceWithEnrollment()); },
          [dispatch]);

      const dataEntryIsReady = useSelector(({ dataEntries }) => (!!dataEntries[dataEntryId]));

      useEffect(() => () => {
          dispatch(cleanUpDataEntry(NEW_TEI_DATA_ENTRY_ID));
          dispatch(cleanUpDataEntry(NEW_SINGLE_EVENT_DATA_ENTRY_ID));
          dispatch(cleanUpDataEntry(NEW_RELATIONSHIP_EVENT_DATA_ENTRY_ID));
      }, [dispatch]);

      return (
          <RegistrationDataEntryComponent
              dataEntryId={dataEntryId}
              selectedScopeId={selectedScopeId}
              setScopeId={setScopeId}
              dataEntryIsReady={dataEntryIsReady}
              onSaveWithoutEnrollment={dispatchOnSaveWithoutEnrollment}
              onSaveWithEnrollment={dispatchOnSaveWithEnrollment}
          />);
  };
