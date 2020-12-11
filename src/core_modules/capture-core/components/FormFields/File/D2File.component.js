// @flow
import CheckIcon from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { orientations } from 'capture-ui';
import Button from '../../Buttons/Button.component';
import { getApi } from '../../../d2/d2Instance';
import { LoadingMask } from '../../LoadingMasks';
import inMemoryFileStore from '../../DataEntry/file/inMemoryFileStore';
import LinkButton from '../../Buttons/LinkButton.component';

type Props = {
  value: ?{ value: string, name: string, url?: ?string },
  disabled?: ?boolean,
  classes: {
    horizontalContainer: string,
    verticalContainer: string,
    innerContainer: string,
    horizontalSelectedFileTextContainer: string,
    verticalSelectedFileTextContainer: string,
    checkIcon: string,
    deleteButton: string,
    input: string,
    horizontalLink: string,
  },
  onCommitAsync: (callback: Function) => void,
  onBlur: (value: ?Object) => void,
  asyncUIState: { loading?: ?boolean },
  orientation: $Values<typeof orientations>,
};

const styles = (theme) => ({
  horizontalContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  verticalContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  innerContainer: {
    padding: theme.typography.pxToRem(2),
    paddingRight: theme.typography.pxToRem(10),
  },
  horizontalSelectedFileTextContainer: {
    padding: theme.typography.pxToRem(2),
    paddingRight: theme.typography.pxToRem(10),
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    wordBreak: 'break-word',
  },
  verticalSelectedFileTextContainer: {
    padding: theme.typography.pxToRem(2),
    paddingRight: theme.typography.pxToRem(10),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'flex-start',
    wordBreak: 'break-word',
  },
  checkIcon: {
    color: theme.palette.success[700],
  },
  deleteButton: {
    color: theme.palette.error.main,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  input: {
    display: 'none',
  },
  horizontalLink: {
    paddingRight: theme.typography.pxToRem(5),
  },
});

class D2File extends Component<Props> {
  hiddenFileSelectorRef: any;

  handleFileChange = (e: Object) => {
    e.preventDefault();
    const file = e.target.files[0];
    e.target.value = null;

    if (file) {
      this.props.onCommitAsync(() => {
        const formData = new FormData();
        formData.append('file', file);
        return getApi()
          .post('fileResources', formData)
          .then((response: any) => {
            const fileResource = response && response.response && response.response.fileResource;
            if (fileResource) {
              inMemoryFileStore.set(fileResource.id, file);
              return {
                name: fileResource.name,
                value: fileResource.id,
              };
            }
            return null;
          });
      });
    }
  };

  handleButtonClick = () => {
    this.hiddenFileSelectorRef.click();
  };

  handleRemoveClick = () => {
    this.props.onBlur(null);
  };

  getFileUrl = () => {
    const { value } = this.props;
    if (value) {
      return value.url || inMemoryFileStore.get(value.value);
    }
    return null;
  };

  render() {
    const { value, classes, asyncUIState, orientation, disabled } = this.props;
    const isUploading = asyncUIState && asyncUIState.loading;
    const fileUrl = this.getFileUrl();
    const isVertical = orientation === orientations.VERTICAL;
    const containerClass = isVertical ? classes.verticalContainer : classes.horizontalContainer;
    const selectedFileTextContainerClass = isVertical
      ? classes.verticalSelectedFileTextContainer
      : classes.horizontalSelectedFileTextContainer;
    return (
      <div>
        <input
          className={classes.input}
          type="file"
          ref={(hiddenFileSelector) => {
            this.hiddenFileSelectorRef = hiddenFileSelector;
          }}
          onChange={(e) => this.handleFileChange(e)}
        />
        {(() => {
          if (isUploading) {
            return (
              <div className={containerClass}>
                <div className={classes.innerContainer}>
                  <LoadingMask />
                </div>
                <div className={classes.innerContainer}>{i18n.t('Uploading file')}</div>
              </div>
            );
          }
          if (value) {
            return (
              <div className={containerClass}>
                <div className={selectedFileTextContainerClass}>
                  <CheckIcon className={classes.checkIcon} />
                  <a
                    className={!isVertical && classes.horizontalLink}
                    target="_blank"
                    href={fileUrl}
                    rel="noopener noreferrer"
                  >
                    {value.name}
                  </a>
                  {` ${i18n.t('selected')}.`}
                </div>
                <div className={classes.innerContainer}>
                  <LinkButton
                    disabled={disabled}
                    onClick={this.handleRemoveClick}
                    className={classes.deleteButton}
                  >
                    {i18n.t('Delete')}
                  </LinkButton>
                </div>
              </div>
            );
          }
          return (
            <div>
              <Button onClick={this.handleButtonClick} color="primary" disabled={disabled}>
                {i18n.t('Select file')}
              </Button>
            </div>
          );
        })()}
      </div>
    );
  }
}

export default withStyles(styles)(D2File);
