// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, type ComponentType } from 'react';
import { RegistrationDataEntryComponent } from './RegistrationDataEntry.component';
import type { OwnProps } from './RegistrationDataEntry.types';
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
