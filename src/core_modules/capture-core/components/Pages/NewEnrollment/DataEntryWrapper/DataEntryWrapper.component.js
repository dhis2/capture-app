// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { Button } from 'capture-ui';
import DataEntry from '../DataEntry/DataEntry.container';
import { type Enrollment } from '../../../../metaData';

const getStyles = (theme: Theme) => ({
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // $FlowFixMe[cannot-spread-inexact] automated comment
  header: {
    flexGrow: 1,
    ...theme.typography.title,
    fontSize: 18,
    fontWeight: 500,
    paddingLeft: 8,
  },
  dataEntryPaper: {
    marginBottom: theme.typography.pxToRem(10),
    padding: theme.typography.pxToRem(10),
  },
  backButton: {
    paddingLeft: 8,
    marginBottom: 10,
    textTransform: 'none',
    backgroundColor: '#E9EEF4',
    boxShadow: 'none',
    color: '#494949',
    fontSize: 14,
    fontWeight: 'normal',
  },
});

type Props = {
  enrollmentMetadata: Enrollment,
  classes: {
    headerContainer: string,
    header: string,
    dataEntryPaper: string,
    backButton: string,
  },
};

class DataEntryWrapper extends React.Component<Props> {
  renderHeaderButtons() {
    const { enrollmentMetadata } = this.props;
    const form = enrollmentMetadata.enrollmentForm;
    if (!form || form.customForm) {
      return null;
    }

    return (
      <Button
        color="primary"
        // onClick={() => this.props.onFormLayoutDirectionChange(!this.props.formHorizontal)}
      >
        {
          // $FlowFixMe[prop-missing] automated comment
          this.props.formHorizontal ? i18n.t('Switch to form view') : i18n.t('Switch to row view')
        }
      </Button>
    );
  }

  renderHeader() {
    const { classes, enrollmentMetadata } = this.props;
    return (
      <div className={classes.headerContainer}>
        <div className={classes.header}>
          {i18n.t('New {{TET}}', {
            TET: enrollmentMetadata.trackedEntityType.name,
          })}
        </div>
        <div>{this.renderHeaderButtons()}</div>
      </div>
    );
  }

  render() {
    const { classes, ...passOnProps } = this.props;
    return (
      <div>
        {/* $FlowFixMe[prop-missing] automated comment */}
        <Button className={classes.backButton} variant="raised" onClick={this.handleBackToMainPage}>
          <ChevronLeft />
          {i18n.t('Working Lists')}
        </Button>
        <Paper className={classes.dataEntryPaper}>
          {this.renderHeader()}
          <DataEntry {...passOnProps} />
        </Paper>
      </div>
    );
  }
}

export default withStyles(getStyles)(DataEntryWrapper);
