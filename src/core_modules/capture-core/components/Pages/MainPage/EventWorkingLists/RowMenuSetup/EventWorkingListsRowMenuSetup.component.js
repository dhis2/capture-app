// @flow
import React, { useMemo, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';
import { EventWorkingListsUpdateTrigger } from '../UpdateTrigger';
import type { CustomRowMenuContents } from '../../WorkingLists';
import type { Props } from './eventWorkingListsRowMenuSetup.types';

const getStyles = (theme: Theme) => ({
  deleteIcon: {
    fill: theme.palette.error.main,
  },
  deleteContainer: {
    display: 'flex',
  },
});

export const EventWorkingListsRowMenuSetupPlain = ({
  onDeleteEvent,
  classes,
  ...passOnProps
}: Props) => {
  const customRowMenuContents: CustomRowMenuContents = useMemo(
    () => [
      {
        key: 'deleteEventItem',
        clickHandler: ({ eventId }) => onDeleteEvent(eventId),
        element: (
          <span data-test="dhis2-capture-delete-event-button" className={classes.deleteContainer}>
            <Delete className={classes.deleteIcon} />
            {i18n.t('Delete event')}
          </span>
        ),
      },
    ],
    [onDeleteEvent, classes.deleteIcon, classes.deleteContainer],
  );

  return (
    <EventWorkingListsUpdateTrigger
      {...passOnProps}
      customRowMenuContents={customRowMenuContents}
    />
  );
};

export const EventWorkingListsRowMenuSetup: ComponentType<$Diff<Props, CssClasses>> = withStyles(
  getStyles,
)(EventWorkingListsRowMenuSetupPlain);
