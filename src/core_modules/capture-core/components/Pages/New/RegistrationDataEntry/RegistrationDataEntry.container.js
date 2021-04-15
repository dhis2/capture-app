// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, type ComponentType, useEffect } from 'react';
import { RegistrationDataEntryComponent } from './RegistrationDataEntry.component';
import type { OwnProps } from './RegistrationDataEntry.types';
import {
    startSavingNewTrackedEntityInstance,
    startSavingNewTrackedEntityInstanceWithEnrollment,
} from './RegistrationDataEntry.actions';
import { cleanUpDataEntry } from '../NewPage.actions';
import { NEW_TEI_DATA_ENTRY_ID } from '../NewPage.component';

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

      useEffect(() => () => dispatch(cleanUpDataEntry(NEW_TEI_DATA_ENTRY_ID)), [dispatch]);

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
