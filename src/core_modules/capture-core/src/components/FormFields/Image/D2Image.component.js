// @flow
import CheckIcon from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import BorderBox from '../../BorderBox/BorderBox.component';
import Button from '../../Buttons/Button.component';
import { getApi } from '../../../d2/d2Instance';
import LoadingMask from '../../LoadingMasks/LoadingMask.component';
import inMemoryFileStore from '../../DataEntry/file/inMemoryFileStore';

type Props = {
    label?: ?string,
    value: ?{ value: string, name: string, url?: ?string },
    classes: {
        imageContainer: string,
        imageInputContainer: string,
        imageInputItemIcon: string,
        imageInputItem: string,
        imageInputDeleteButton: string,
        imageInput: string,
        imageLoadingProgress: string,
        imagePreview: string,
    },
    onCommitAsync: (callback: Function) => void,
    onBlur: (value: ?Object) => void,
    onUpdateAsyncUIState: (uiStateToAdd: Object) => void,
    asyncUIState: { loading?: ?boolean },
}

const styles = (theme: Theme) => ({
    imageContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    imageInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageInputItemIcon: {
        color: theme.palette.success[700],
    },
    imageInputItem: {
        marginRight: theme.typography.pxToRem(10),
    },
    imageInputDeleteButton: {
        margin: theme.typography.pxToRem(8),
        color: theme.palette.error.main,
    },
    imageLoadingProgress: {
        marginRight: theme.typography.pxToRem(10),
    },
    imageInput: {
        display: 'none',
    },
    imagePreview: {
        maxHeight: theme.typography.pxToRem(400),
        maxWidth: '100%',
    },
});

class D2Image extends Component<Props> {
    hiddenimageSelectorRef: any;

    handleImageChange = (e: Object) => {
        e.preventDefault();
        const image = e.target.files[0];
        e.target.value = null;

        if (image) {
            this.props.onUpdateAsyncUIState({ loading: true });
            this.props.onCommitAsync(() => {
                const formData = new FormData();
                formData.append('file', image);
                return getApi().post('fileResources', formData).then((response: any) => {
                    const fileResource = response && response.response && response.response.fileResource;
                    if (fileResource) {
                        inMemoryFileStore.set(fileResource.id, image);
                        return { name: fileResource.name, value: fileResource.id };
                    }
                    return null;
                });
            });
        }
    }
    handleButtonClick = () => {
        this.hiddenimageSelectorRef.click();
    }

    handleRemoveClick = () => {
        this.props.onBlur(null);
    }

    getimageUrl = () => {
        const value = this.props.value;
        if (value) {
            return value.url || inMemoryFileStore.get(value.value);
        }
        return null;
    }

    render() {
        const { label, value, classes, asyncUIState } = this.props;
        const isUploading = asyncUIState && asyncUIState.loading;
        const imageUrl = this.getimageUrl();
        return (
            <BorderBox>
                <div className={classes.imageContainer}>
                    <div>
                        {label || ''}
                    </div>

                    <input
                        className={classes.imageInput}
                        type="file"
                        accept="image/*"
                        ref={(hiddenimageSelector) => {
                            this.hiddenimageSelectorRef = hiddenimageSelector;
                        }}
                        onChange={e => this.handleImageChange(e)}
                    />
                    {
                        (() => {
                            if (isUploading) {
                                return (
                                    <div className={classes.imageInputContainer}>
                                        <LoadingMask className={classes.imageLoadingProgress} size={40} />
                                        <div className={classes.imageInputItem}>{i18n.t('Uploading image')}</div>
                                    </div>);
                            } else if (value) {
                                return (
                                    <div>
                                        <div className={classes.imageInputContainer}>
                                            <CheckIcon className={classes.imageInputItemIcon} />
                                            <div className={classes.imageInputItem}>
                                                {`${value.name} ${i18n.t('selected')}.`}
                                            </div>
                                            <div className={classes.imageInputItem}>
                                                <Button
                                                    onClick={this.handleRemoveClick}
                                                    className={classes.imageInputDeleteButton}
                                                >
                                                    {i18n.t('Delete')}
                                                </Button>
                                            </div>
                                        </div>
                                        <div>
                                            <a
                                                target="_blank"
                                                href={imageUrl}
                                            >
                                                <img src={imageUrl} alt="" className={classes.imagePreview} />
                                            </a>
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div className={classes.imageInputContainer}>
                                    <div className={classes.imageInputItem}>
                                        <Button
                                            onClick={this.handleButtonClick}
                                            color="primary"
                                        >
                                            {i18n.t('Select image')}
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

export default withStyles(styles)(D2Image);
