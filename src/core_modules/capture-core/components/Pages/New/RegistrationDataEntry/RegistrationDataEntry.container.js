// @flow
import { useDispatch } from 'react-redux';
import React, { useCallback, type ComponentType } from 'react';
import { RegistrationDataEntryComponent } from './RegistrationDataEntry.component';
import type { OwnProps } from './RegistrationDataEntry.types';
import {
    startSavingNewTrackedEntityType,
    startSavingNewTrackedEntityTypeWithEnrollment,
} from './RegistrationDataEntry.actions';

export const RegistrationDataEntry: ComponentType<OwnProps>
  = ({ selectedScopeId, dataEntryId, setScopeId }) => {
      const dispatch = useDispatch();

      const dispatchOnSaveWithoutEnrollment = useCallback(
          () => { dispatch(startSavingNewTrackedEntityType()); },
          [dispatch]);

      const dispatchOnSaveWithEnrollment = useCallback(
          () => { dispatch(startSavingNewTrackedEntityTypeWithEnrollment()); },
          [dispatch]);


      return (
          <RegistrationDataEntryComponent
              dataEntryId={dataEntryId}
              selectedScopeId={selectedScopeId}
              onSaveWithoutEnrollment={dispatchOnSaveWithoutEnrollment}
              onSaveWithEnrollment={dispatchOnSaveWithEnrollment}
              setScopeId={setScopeId}
          />);
  };
