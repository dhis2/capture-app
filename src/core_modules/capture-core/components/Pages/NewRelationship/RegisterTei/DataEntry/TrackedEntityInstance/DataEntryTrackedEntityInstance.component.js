// @flow
import React from 'react';
import { withTheme } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { useSelector } from 'react-redux';
import type { RenderFoundation, TeiRegistration } from '../../../../../../metaData';
import { DATA_ENTRY_ID } from '../../registerTei.const';
import teiClasses from './trackedEntityInstance.module.css';
import getDataEntryKey from '../../../../../DataEntry/common/getDataEntryKey';
import { TeiRegistrationEntry } from '../../../../../DataEntries/TeiRegistrationEntry/TeiRegistrationEntry.component';

type Props = {|
    theme: Theme,
    onSave: (dataEntryId: string, itemId: string, formFoundation: RenderFoundation) => void,
    onGetUnsavedAttributeValues: Function,
    onPostProcessErrorMessage: Function,
    teiRegistrationMetadata: ?TeiRegistration,
|};
const usePossibleDuplicatesFound = () =>
    useSelector(({ dataEntriesSearchGroupsResults, dataEntries }) => {
        const dataEntryKey = getDataEntryKey(DATA_ENTRY_ID, dataEntries[DATA_ENTRY_ID].itemId);

        return Boolean(
            dataEntriesSearchGroupsResults[dataEntryKey] &&
    dataEntriesSearchGroupsResults[dataEntryKey].main &&
    dataEntriesSearchGroupsResults[dataEntryKey].main.count,
        );
    });

const getButtonText = (duplicatesFound: boolean, trackedEntityTypeName: string) => {
    const trackedEntityTypeNameLC = trackedEntityTypeName.toLocaleLowerCase();
    return duplicatesFound ?
        i18n.t('Review Duplicates') :
        i18n.t('Create {{trackedEntityTypeName}} and link', { trackedEntityTypeName: trackedEntityTypeNameLC });
};

const RelationshipTrackedEntityInstance =
  ({
      theme,
      onSave,
      onGetUnsavedAttributeValues,
      onPostProcessErrorMessage,
      teiRegistrationMetadata = {},
  }: Props) => {
      const possibleDuplicatesFound = usePossibleDuplicatesFound();

      const fieldOptions = { theme, fieldLabelMediaBasedClass: teiClasses.fieldLabelMediaBased };
      const { trackedEntityType } = teiRegistrationMetadata || {};
      const saveButtonText = getButtonText(possibleDuplicatesFound, trackedEntityType.name);
      return (
          <TeiRegistrationEntry
              id={DATA_ENTRY_ID}
              teiRegistrationMetadata={teiRegistrationMetadata}
              selectedScopeId={teiRegistrationMetadata && teiRegistrationMetadata.form.id}
              saveButtonText={saveButtonText}
              fieldOptions={fieldOptions}
              onSave={onSave}
              onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
              onPostProcessErrorMessage={onPostProcessErrorMessage}
          />
      );
  };

export default withTheme()(RelationshipTrackedEntityInstance);
