// @flow
import React, { type ComponentType, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Pagination } from 'capture-ui';
import withNavigation from '../../../../../../Pagination/withDefaultNavigation';
import { ResultsPageSizeContext } from '../../../../../shared-contexts';
import type { Props } from './ReviewDialogContentsPager.types';

const Pager = withNavigation()(Pagination);

const getStyles = (theme: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: theme.typography.pxToRem(8),
    maxWidth: theme.typography.pxToRem(600),
  },
});

const ReviewDialogContentsPagerPlain = ({
  onChangePage,
  currentPage,
  nextPageButtonDisabled,
  classes,
}: Props) => {
  const { resultsPageSize } = useContext(ResultsPageSizeContext);

  return (
    <div className={classes.container}>
      <Pager
        currentPage={currentPage}
        onChangePage={(page) => onChangePage(page, resultsPageSize)}
        nextPageButtonDisabled={nextPageButtonDisabled}
      />
    </div>
  );
};

export const ReviewDialogContentsPagerComponent: ComponentType<
  $Diff<Props, CssClasses>,
> = withStyles(getStyles)(ReviewDialogContentsPagerPlain);
