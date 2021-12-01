// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, type ComponentType, useEffect } from 'react';
import { NEW_RELATIONSHIP_EVENT_DATA_ENTRY_ID, NEW_SINGLE_EVENT_DATA_ENTRY_ID, NEW_TEI_DATA_ENTRY_ID } from '../NewPage.component';
import { cleanUpDataEntry } from '../NewPage.actions';
import type { OwnProps } from './RegistrationDataEntry.types';
import { RegistrationDataEntryComponent } from './RegistrationDataEntry.component';
import {
    startSavingNewTrackedEntityInstance,
    startSavingNewTrackedEntityInstanceWithEnrollment,
} from './RegistrationDataEntry.actions';

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
