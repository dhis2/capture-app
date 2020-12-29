// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { Button } from '../../Buttons';
import OrgUnitField from './OrgUnitField.container';

const styles = (theme: Theme) => ({
    paper: {
        padding: 8,
        backgroundColor: theme.palette.grey.lighter,
    },
    title: {
        margin: 0,
        fontWeight: 425,
        fontSize: 15,
        paddingBottom: 5,
    },
    form: {
        width: '100%',
    },
    listItem: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        marginBottom: 5,
        padding: 5,
        border: '1px solid lightGrey',
    },
    selectedText: {
        marginTop: 5,
        marginBottom: 5,
        padding: 5,
        borderLeft: '2px solid #71a4f8',
    },
    selectedPaper: {
        backgroundColor: theme.palette.grey.lighter,
        padding: 8,
    },
    selectedButton: {
        width: 20,
        height: 20,
        padding: 0,
    },
    selectedButtonIcon: {
        width: 20,
        height: 20,
    },
    selectedItemContainer: {
        display: 'flex',
        alignItems: 'center',
        minHeight: 28,
        marginTop: 7,
        paddingLeft: 5,
        borderLeft: `2px solid ${theme.palette.primary.light}`,
    },
    selectedItemClear: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'flex-end',
    },
});

type Props = {|
    onReset: () => void,
    onSelect: () => void,
    selected: boolean,
    title: string,
    selectionName: string,
    ...CssClasses
|};

const SingleLockedSelectPlain =
  ({
      title,
      onReset,
      onSelect,
      selected = true,
      selectionName = 'I am selected',
      classes,
  }: Props) => (<>
      {
          selected ?
              <Paper square elevation={0} className={classes.selectedPaper}>
                  <h4 className={classes.title}>{ title }</h4>
                  <div className={classes.selectedItemContainer}>
                      <div>{selectionName}</div>

                      <div className={classes.selectedItemClear}>
                          <IconButton className={classes.selectedButton} onClick={onReset}>
                              <ClearIcon className={classes.selectedButtonIcon} />
                          </IconButton>
                      </div>
                  </div>
              </Paper>
              :
              <div data-test="dhis2-capture-org-unit-selector-container">
                  <Paper square elevation={0} className={classes.paper}>
                      <h4 className={classes.title}>{ i18n.t('Registering Organisation Unit') }</h4>
                      <div>
                          <OrgUnitField
                              data-test="dhis2-capture-org-unit-field"
                              onSelectClick={onSelect}
                          />
                      </div>
                  </Paper>
              </div>
      }
  </>
  );

export const SingleLockedSelect = withStyles(styles)(SingleLockedSelectPlain);
