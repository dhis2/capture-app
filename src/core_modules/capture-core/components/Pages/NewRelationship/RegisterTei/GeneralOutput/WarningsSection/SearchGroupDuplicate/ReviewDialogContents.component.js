// @flow
import React, { type ComponentType, useContext } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '../../../../../../Buttons';
import { CardList } from '../../../../../../CardList';
import { ReviewDialogContentsPager } from './ReviewDialogContentsPager.container';
import { ResultsPageSizeContext } from '../../../../../shared-contexts';
import type { Props } from './ReviewDialogContents.types';

const getStyles = (theme: Theme) => ({
  linkButtonContainer: {
    paddingTop: theme.typography.pxToRem(10),
  },
  title: {
    paddingLeft: theme.typography.pxToRem(10),
  },
});

const ReviewDialogContentsPlain = ({ onLink, classes, dataElements, teis }: Props) => {
  const { resultsPageSize } = useContext(ResultsPageSizeContext);
  const getLinkButton = (itemProps: Object) => {
    const { id, values } = itemProps.item;
    return (
      <div className={classes.linkButtonContainer}>
        <Button
          onClick={() => {
            onLink(id, values);
          }}
        >
          {i18n.t('Link')}
        </Button>
      </div>
    );
  };

  return (
    <>
      <DialogContent data-test="dhis2-capture-duplicates-modal">
        <DialogTitle className={classes.title}>{i18n.t('Possible duplicates found')}</DialogTitle>
        <CardList
          noItemsText={i18n.t('No results found')}
          items={teis}
          dataElements={dataElements}
          getCustomItemBottomElements={getLinkButton}
        />

        <ReviewDialogContentsPager nextPageButtonDisabled={teis.length < resultsPageSize} />
      </DialogContent>
    </>
  );
};

export const ReviewDialogContentsComponent: ComponentType<Props> = withStyles(getStyles)(
  ReviewDialogContentsPlain,
);
