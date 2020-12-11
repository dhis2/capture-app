// @flow

import { createSelector } from 'reselect';
import {
  getTrackedEntityTypeThrowIfNotFound,
  getTrackerProgramThrowIfNotFound,
  TrackedEntityType,
  TrackerProgram,
} from '../../../../../../metaData';

const TETIdSelector = (state) =>
  state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId;

export const makeTETSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(TETIdSelector, (TETId: string) => {
    let TEType;
    try {
      TEType = getTrackedEntityTypeThrowIfNotFound(TETId);
    } catch (error) {
      return null;
    }

    return TEType;
  });

const programIdSelector = (state) => state.newRelationshipRegisterTei.programId;
const attributeIdSelector = (state, props) => props.id;

function getAttributeNameFromTETMetadata(attributeId: string, tetMetadata: TrackedEntityType) {
  const element = tetMetadata.teiRegistration.form.getElement(attributeId);
  return element ? element.name : null;
}

function getAttributeNameFromProgramMetadata(attributeId: string, programMetadata: TrackerProgram) {
  const element = programMetadata.enrollment.enrollmentForm.getElement(attributeId);
  return element ? element.name : null;
}

export const makeAttributeNameSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(
    programIdSelector,
    attributeIdSelector,
    (state, props, trackedEntityType) => trackedEntityType,
    (programId: ?string, attributeId: string, trackedEntityType: ?TrackedEntityType) => {
      if (!programId) {
        if (!trackedEntityType) {
          return null;
        }
        return getAttributeNameFromTETMetadata(attributeId, trackedEntityType);
      }

      let program: TrackerProgram;
      try {
        program = getTrackerProgramThrowIfNotFound(programId);
      } catch (error) {
        return null;
      }

      return getAttributeNameFromProgramMetadata(attributeId, program);
    },
  );
