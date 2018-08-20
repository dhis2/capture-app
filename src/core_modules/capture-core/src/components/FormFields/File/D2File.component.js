// @flow
import CheckIcon from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import i18n from '@dhis2/d2-i18n';
import BorderBox from '../../BorderBox/BorderBox.component';
import Button from '../../Buttons/Button.component';
import { getApi } from '../../../d2/d2Instance';
import LoadingMask from '../../LoadingMasks/LoadingMask.component';
import inMemoryFileStore from '../../DataEntry/file/inMemoryFileStore';

type Props = {
    label?: ?string,
    value: ?{ value: string, name: string, url?: ?string },
    disabled?: ?boolean,
    required?: ?boolean,
    classes: {
        horizontalLabel: string,
        outerContainer: string,
        container: string,
        inputContainer: string,
        inputItemIcon: string,
        inputItem: string,
        input: string,
        loadingProgress: string,
        horizontalSelectButton: string,
        horizontalDeleteButton: string,
        verticalDeleteButton: string,
        borderBoxContent: string,
    },
    onCommitAsync: (callback: Function) => void,
    onBlur: (value: ?Object) => void,
    onUpdateAsyncUIState: (uiStateToAdd: Object) => void,
    asyncUIState: { loading?: ?boolean },
    formHorizontal?: ?boolean,
}

const styles = theme => ({
    horizontalLabel: theme.typography.formFieldTitle,
    outerContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputItemIcon: {
        color: theme.palette.success[700],
    },
    inputItem: {
        marginRight: theme.typography.pxToRem(10),
    },
    verticalDeleteButton: {
        margin: theme.typography.pxToRem(8),
        color: theme.palette.error.main,
    },
    horizontalDeleteButton: {
        margin: theme.typography.pxToRem(4),
        minHeight: theme.typography.pxToRem(28),
        color: theme.palette.error.main,
    },
    horizontalSelectButton: {
        margin: theme.typography.pxToRem(4),
        minHeight: theme.typography.pxToRem(28),
    },
    loadingProgress: {
        marginRight: theme.typography.pxToRem(10),
    },
    input: {
        display: 'none',
    },
    borderBoxContent: {
        display: 'flex',
        alignItems: 'center',
        margin: theme.typography.pxToRem(10),
    },
});

class D2File extends Component<Props> {
    hiddenFileSelectorRef: any;

    handleFileChange = (e: Object) => {
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
                        inMemoryFileStore.set(fileResource.id, file);
                        return { name: fileResource.name, value: fileResource.id };
                    }
                    return null;
                });
            });
        }
    }
    handleButtonClick = () => {
        this.hiddenFileSelectorRef.click();
    }

    handleRemoveClick = () => {
        this.props.onBlur(null);
    }

    getFileUrl = () => {
        const value = this.props.value;
        if (value) {
            return value.url || inMemoryFileStore.get(value.value);
        }
        return null;
    }

    renderHorizontal = () => {
        const classes = this.props.classes;
        const contentClasses = {
            label: classes.horizontalLabel,
            selectButton: classes.horizontalSelectButton,
            deleteButton: classes.horizontalDeleteButton,
        };
        const sizes = {
            button: 'small',
            progress: 30,
        };
        return this.renderContent(contentClasses, sizes);
    }

    renderVertical = () => {
        const classes = this.props.classes;
        const contentClasses = {
            deleteButton: classes.verticalDeleteButton,
        };
        const sizes = {
            button: 'medium',
            progress: 40,
        };
        return (
            <BorderBox contentClassName={classes.borderBoxContent}>
                {this.renderContent(contentClasses, sizes)}
            </BorderBox>
        );
    }

    renderContent = (contentClasses: Object, sizes: Object) => {
        const { label, value, classes, asyncUIState, disabled, required } = this.props;
        const isUploading = asyncUIState && asyncUIState.loading;
        const fileUrl = this.getFileUrl();
        return (
            <div className={classes.outerContainer}>
                <InputLabel
                    classes={{ root: contentClasses.label }}
                    disabled={!!disabled}
                    required={!!required}
                >
                    {label}
                </InputLabel>
                <div className={classes.container}>
                    <input
                        className={classes.input}
                        type="file"
                        ref={(hiddenFileSelector) => {
                            this.hiddenFileSelectorRef = hiddenFileSelector;
                        }}
                        onChange={e => this.handleFileChange(e)}
                    />
                    {
                        (() => {
                            if (isUploading) {
                                return (
                                    <div className={classes.inputContainer}>
                                        <LoadingMask className={classes.loadingProgress} size={sizes.progress} />
                                        <div className={classes.inputItem}>{i18n.t('Uploading file')}</div>
                                    </div>);
                            } else if (value) {
                                return (
                                    <div className={classes.inputContainer}>
                                        <CheckIcon className={classes.inputItemIcon} />
                                        <div className={classes.inputItem}>
                                            <a
                                                download={value.name}
                                                target="_blank"
                                                href={fileUrl}
                                            >
                                                {value.name}
                                            </a>
                                            {` ${i18n.t('selected')}.`}
                                        </div>
                                        <div className={classes.inputItem}>
                                            <Button
                                                size={sizes.button}
                                                onClick={this.handleRemoveClick}
                                                className={contentClasses.deleteButton}
                                            >
                                                {i18n.t('Delete')}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div className={classes.inputContainer}>
                                    <div className={classes.inputItem}>
                                        <Button
                                            size={sizes.button}
                                            className={contentClasses.selectButton}
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
            </div>
        );
    }


    render() {
        return this.props.formHorizontal ? this.renderHorizontal() : this.renderVertical();
    }
}

export default withStyles(styles)(D2File);
