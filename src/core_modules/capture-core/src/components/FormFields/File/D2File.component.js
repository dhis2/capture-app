// @flow
import CheckIcon from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import BorderBox from '../../BorderBox/borderBox.component';
import Button from '../../Buttons/Button.component';
import { getApi } from '../../../d2/d2Instance';
import LoadingMask from '../../LoadingMasks/LoadingMask.component';

type Props = {
    label?: ?string,
    value: ?{ value: string, name: string },
    classes: {
        fileContainer: string,
        fileInputContainer: string,
        fileInputItemIcon: string,
        fileInputItem: string,
        fileInputDeleteButton: string,
        fileInput: string,
        fileLoadingProgress: string,
    },
    onCommitAsync: (callback: Function) => void,
    onBlur: (value: ?Object) => void,
    onUpdateAsyncUIState: (uiStateToAdd: Object) => void,
    asyncUIState: { loading?: ?boolean },
}

const styles = (theme: Theme) => ({
    fileContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    fileInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    fileInputItemIcon: {
        color: 'green',
    },
    fileInputItem: {
        marginRight: theme.typography.pxToRem(10),
    },
    fileInputDeleteButton: {
        margin: theme.typography.pxToRem(8),
        color: theme.palette.error.main,
    },
    fileLoadingProgress: {
        marginRight: theme.typography.pxToRem(10),
    },
    fileInput: {
        display: 'none',
    },
});

class D2File extends Component<Props> {
    containerInstance: ?HTMLElement;
    materialUIContainerInstance: any;

    goto: () => void;
    handleRemoveClick: () => void;
    hiddenFileSelectorRef: any;
    handleButtonClick: () => void;

    constructor(props: Props) {
        super(props);
        // this.goto = gotoFn;
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleImageChange(e: Object) {
        e.preventDefault();
        const file = e.target.files[0];
        e.target.value = null;

        if (file) {
            this.props.onUpdateAsyncUIState({ loading: true });
            this.props.onCommitAsync(() => {
                const formData = new FormData();
                formData.append('file', file);
                return getApi().post('fileResources', formData).then((response: any) => {
                    const fileResource = response && response.response && response.response.fileResource;
                    if (fileResource) {
                        return { name: fileResource.name, value: fileResource.id };
                    }
                    return null;
                });
            });
        }
    }
    handleButtonClick() {
        this.hiddenFileSelectorRef.click();
    }

    handleRemoveClick() {
        this.props.onBlur(null);
    }

    render() {
        const { label, value, classes, asyncUIState } = this.props;
        const isUploading = asyncUIState && asyncUIState.loading;
        return (
            <BorderBox>
                <div className={classes.fileContainer}>
                    <div>
                        {label || ''}
                    </div>

                    <input
                        className={classes.fileInput}
                        type="file"
                        accept="image/*"
                        ref={(hiddenFileSelector) => {
                            this.hiddenFileSelectorRef = hiddenFileSelector;
                        }}
                        onChange={e => this.handleImageChange(e)}
                    />
                    {
                        (() => {
                            if (isUploading) {
                                return (
                                    <div className={classes.fileInputContainer}>
                                        <LoadingMask className={classes.fileLoadingProgress} size={40} />
                                        <div className={classes.fileInputItem}>{i18n.t('Uploading file')}</div>
                                    </div>);
                            } else if (value) {
                                return (
                                    <div className={classes.fileInputContainer}>
                                        <CheckIcon className={classes.fileInputItemIcon} />
                                        <div className={classes.fileInputItem}>
                                            <a
                                                href=""
                                            >
                                                {value.name}
                                            </a>
                                            {` ${i18n.t('selected')}.`}
                                        </div>
                                        <div className={classes.fileInputItem}>
                                            <Button
                                                onClick={this.handleRemoveClick}
                                                className={classes.fileInputDeleteButton}
                                            >
                                                {i18n.t('Delete')}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div className={classes.fileInputContainer}>
                                    <div className={classes.fileInputItem}>
                                        <Button
                                            onClick={this.handleButtonClick}
                                            color="primary"
                                        >
                                            {i18n.t('Select file')}
                                        </Button>
                                    </div>
                                </div>

                            );
                        })()
                    }
                </div>
            </BorderBox>
        );
    }
}

export default withStyles(styles)(D2File);
