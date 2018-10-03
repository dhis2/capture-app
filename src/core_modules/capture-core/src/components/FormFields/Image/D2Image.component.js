// @flow
import CheckIcon from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import Button from '../../Buttons/Button.component';
import { getApi } from '../../../d2/d2Instance';
import LoadingMask from '../../LoadingMasks/LoadingMask.component';
import inMemoryFileStore from '../../DataEntry/file/inMemoryFileStore';
import orientations from '../../d2UiReactAdapters/constants/orientations.const';


type Props = {
    value: ?{ value: string, name: string, url?: ?string },
    orientation: $Values<typeof orientations>,
    classes: {
        container: string,
        verticalContainer: string,
        innerContainer: string,
        selectedImageTextContainer: string,
        checkIcon: string,
        deleteButton: string,
        input: string,
        image: string,
    },
    onCommitAsync: (callback: Function) => void,
    onBlur: (value: ?Object) => void,
    onUpdateAsyncUIState: (uiStateToAdd: Object) => void,
    asyncUIState: { loading?: ?boolean },
}

const styles = theme => ({
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
    horizontalSelectedImageTextContainer: {
        padding: theme.typography.pxToRem(2),
        paddingRight: theme.typography.pxToRem(10),
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        wordBreak: 'break-word',
    },
    verticalSelectedImageTextContainer: {
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
    image: {
        maxHeight: theme.typography.pxToRem(52),
        maxWidth: theme.typography.pxToRem(70),
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

    render = () => {
        const { value, classes, asyncUIState, orientation } = this.props;
        const isVertical = orientation === orientations.VERTICAL;
        const isUploading = asyncUIState && asyncUIState.loading;
        const imageUrl = this.getimageUrl();
        const containerClass = isVertical ? classes.verticalContainer : classes.horizontalContainer;
        const selectedImageTextContainerClass = isVertical ? classes.verticalSelectedImageTextContainer : classes.horizontalSelectedImageTextContainer;
        return (
            <div>
                <input
                    className={classes.input}
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
                                <div className={containerClass}>
                                    <div className={classes.innerContainer}>
                                        <LoadingMask />
                                    </div>
                                    <div className={classes.innerContainer}>{i18n.t('Uploading image')}</div>
                                </div>);
                        } else if (value) {
                            return (
                                <div className={containerClass}>
                                    {!isVertical &&
                                        <div className={classes.innerContainer}>
                                            <a
                                                target="_blank"
                                                href={imageUrl}
                                            >
                                                <img src={imageUrl} alt="" className={classes.image} />
                                            </a>
                                        </div>
                                    }
                                    <div className={selectedImageTextContainerClass}>
                                        <CheckIcon className={classes.checkIcon} />
                                        {!isVertical ?
                                            value.name :
                                            <a
                                                target="_blank"
                                                href={imageUrl}
                                            >
                                                {value.name}
                                            </a>
                                        }
                                        {` ${i18n.t('selected')}.`}
                                    </div>
                                    <div className={classes.innerContainer}>
                                        <div
                                            role="presentation"
                                            onClick={this.handleRemoveClick}
                                            className={classes.deleteButton}
                                        >
                                            {i18n.t('Delete')}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div>
                                <Button
                                    onClick={this.handleButtonClick}
                                    color="primary"
                                >
                                    {i18n.t('Select image')}
                                </Button>
                            </div>

                        );
                    })()
                }
            </div>
        );
    }
}

export default withStyles(styles)(D2Image);
