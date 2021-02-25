// @flow
import React, { type ComponentType, useCallback, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import i18n from '@dhis2/d2-i18n';
import Select from 'react-virtualized-select';
import { compose } from 'redux';
import { withLoadingIndicator } from '../../../HOC';

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
        marginTop: 8,
        marginBottom: 4,
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
    options: Array<{|label: string, value: any, |}>,
    onClear?: () => void,
    onSelect?: (value: string) => void,
    title: string,
    selectedValue: string,
    ...CssClasses
|};

type ReadyProp = {|
    ready: boolean,
|};

const SingleLockedSelectPlain =
  ({
      onClear,
      onSelect,
      title,
      selectedValue,
      options,
      classes,
  }: Props) => {
      const [selected, toggleSelected] = useState((Boolean(selectedValue)));

      const handleOnClear = () => {
          toggleSelected(false);
          onClear && onClear();
      };
      const handleOnSelect = useCallback(({ value }) => {
          toggleSelected(true);
          onSelect && onSelect(value);
      },
      [onSelect]);

      const { label } = options.find((({ value }) => value === selectedValue)) || {};
      return (<>
          {
              selected && label ?
                  <Paper square elevation={0} className={classes.selectedPaper}>
                      <h4 className={classes.title}>
                          {i18n.t('Selected')} {title.toLowerCase()}
                      </h4>
                      <div className={classes.selectedItemContainer}>
                          <div>{label}</div>

                          <div className={classes.selectedItemClear}>
                              <IconButton data-test="reset-selection-button" className={classes.selectedButton} onClick={handleOnClear}>
                                  <ClearIcon className={classes.selectedButtonIcon} />
                              </IconButton>
                          </div>
                      </div>
                  </Paper>
                  :
                  <div data-test="dhis2-capture-org-unit-selector-container">
                      <Paper square elevation={0} className={classes.paper}>
                          <h4 className={classes.title}>
                              { title }
                          </h4>
                          <Select
                              onChange={handleOnSelect}
                              options={options}
                          />
                      </Paper>
                  </div>
          }
      </>);
  };

export const SingleLockedSelect: ComponentType<$Diff<Props & ReadyProp, CssClasses>>
  = compose(
      withLoadingIndicator(() => ({ height: '100%', alignItems: 'center', justifyContent: 'center' }), () => ({ size: 15 })),
      withStyles(styles),
  )(SingleLockedSelectPlain);
