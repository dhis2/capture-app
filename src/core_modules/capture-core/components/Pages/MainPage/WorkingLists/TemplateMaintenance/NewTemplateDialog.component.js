// @flow
import * as React from 'react';
import { Dialog } from '@material-ui/core';
import NewTemplateContents from './NewTemplateContents.component';

type Props = {
  open: boolean,
  onClose: () => void,
  onSaveTemplate: (name: string) => void,
};

const NewTemplateDialog = (props: Props) => {
  const { open, onClose, onSaveTemplate } = props;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <NewTemplateContents onSaveTemplate={onSaveTemplate} onClose={onClose} />
    </Dialog>
  );
};

export default NewTemplateDialog;
