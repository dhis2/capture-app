// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, IconButton } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import { Button } from '../../../../Buttons';

const getStyles = () => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  nameContainer: {
    paddingRight: 5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  iconContainer: {
    width: 24,
  },
  editButton: {
    color: 'inherit',
  },
  addIcon: {
    paddingRight: 5,
  },
});

type User = {
  id: string,
  username: string,
  name: string,
};

type Props = {
  assignee: ?User,
  onEdit: () => void,
  classes: Object,
  eventAccess: { read: boolean, write: boolean },
};

const DisplayMode = (props: Props) => {
  const { eventAccess, assignee, onEdit, classes } = props;

  if (!assignee) {
    if (!eventAccess.write) {
      return <div>{i18n.t('No one is assigned to this event')}</div>;
    }
    return (
      <div>
        <Button onClick={onEdit} small>
          {i18n.t('Assign')}
        </Button>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.nameContainer}>
        {i18n.t('Event assigned to {{name}}', { name: assignee.name })}
      </div>
      <div className={classes.iconContainer}>
        {eventAccess.write ? (
          <IconButton onClick={onEdit} className={classes.editButton}>
            <EditIcon />
          </IconButton>
        ) : null}
      </div>
    </div>
  );
};

export default withStyles(getStyles)(DisplayMode);
