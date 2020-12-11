// @flow
import React, { type ComponentType, useContext, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '../../../Buttons';
import { RegisterTeiDataEntry } from './DataEntry/RegisterTeiDataEntry.container';
import { RegistrationSection } from './RegistrationSection';
import GeneralOutput from './GeneralOutput/GeneralOutput.container';
import { ReviewDialog } from './GeneralOutput/WarningsSection/SearchGroupDuplicate/ReviewDialog.component';
import { ResultsPageSizeContext } from '../../shared-contexts';
import type { Props } from './RegisterTei.types';

const getStyles = () => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  leftContainer: {
    flexGrow: 10,
    flexBasis: 0,
    margin: 8,
  },
});

const RegisterTeiPlain = ({
  onLink,
  onSave,
  onReviewDuplicates,
  onGetUnsavedAttributeValues,
  possibleDuplicates,
  tetName,
  classes,
}: Props) => {
  const { resultsPageSize } = useContext(ResultsPageSizeContext);

  const [duplicatesOpen, toggleDuplicatesModal] = useState(false);
  const [savedArguments, setArguments] = useState([]);

  function handleSaveAttempt(...args) {
    if (possibleDuplicates) {
      setArguments(args);
      onReviewDuplicates(resultsPageSize);
      toggleDuplicatesModal(true);
    } else {
      onSave(...args);
    }
  }

  const handleSaveFromDialog = () => {
    onSave(...savedArguments);
  };

  const handleDialogCancel = () => {
    toggleDuplicatesModal(false);
  };

  const getActions = () => (
    <>
      <Button onClick={handleDialogCancel} secondary>
        {i18n.t('Cancel')}
      </Button>
      <div style={{ marginLeft: 16 }}>
        <Button
          dataTest="dhis2-capture-create-as-new-person"
          onClick={handleSaveFromDialog}
          primary
        >
          {i18n.t('Save as new {{tetName}}', { tetName })}
        </Button>
      </div>
    </>
  );

  return (
    <div className={classes.container}>
      <div className={classes.leftContainer}>
        <RegistrationSection />
        <RegisterTeiDataEntry
          onLink={onLink}
          onSave={handleSaveAttempt}
          onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
        />
      </div>
      <GeneralOutput onLink={onLink} />
      <ReviewDialog
        open={duplicatesOpen}
        onLink={onLink}
        onCancel={handleDialogCancel}
        extraActions={getActions()}
      />
    </div>
  );
};

export const RegisterTeiComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(
  RegisterTeiPlain,
);
