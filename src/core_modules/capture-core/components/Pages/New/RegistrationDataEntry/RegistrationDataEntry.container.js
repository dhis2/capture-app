// @flow
import { useDispatch } from 'react-redux';
import React, { useCallback, type ComponentType } from 'react';
import { RegistrationDataEntryComponent } from './RegistrationDataEntry.component';
import type { OwnProps } from './RegistrationDataEntry.types';
import { startSavingNewTrackedEntityType } from './RegistrationDataEntry.actions';

export const RegistrationDataEntry: ComponentType<OwnProps>
  = ({ selectedScopeId, dataEntryId, setScopeId }) => {
      const dispatch = useDispatch();

      const dispatchOnSave = useCallback(
          () => { dispatch(startSavingNewTrackedEntityType()); },
          [dispatch]);


      return (
          <RegistrationDataEntryComponent
              dataEntryId={dataEntryId}
              selectedScopeId={selectedScopeId}
              onSave={dispatchOnSave}
              setScopeId={setScopeId}
          />);
  };
