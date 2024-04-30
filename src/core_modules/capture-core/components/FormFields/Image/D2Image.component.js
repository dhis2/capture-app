// @flow
import { IconCheckmark24, colors, CircularLoader, Button } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { orientations } from 'capture-ui';
import { LinkButton } from '../../Buttons/LinkButton.component';
import { inMemoryFileStore } from '../../DataEntry/file/inMemoryFileStore';
import { withApiUtils } from '../../../HOC';

type Props = {
    value: ?{ value: string, name: string, url?: ?string, previewUrl: ?string },
    orientation: $Values<typeof orientations>,
    disabled?: ?boolean,
    classes: {
        container: string,
        verticalContainer: string,
        innerContainer: string,
        selectedImageTextContainer: string,
        deleteButton: string,
        input: string,
        image: string,
    },
    onCommitAsync: (callback: Function) => void,
    onBlur: (value: ?Object) => void,
    asyncUIState: { loading?: ?boolean },
    mutate: (data: any) => Promise<any>
}

type State = {
    imageSelectorOpen: boolean,
};

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
    deleteButton: {
        color: theme.palette.error.main,
    },
    input: {
        display: 'none',
    },
    image: {
        maxHeight: theme.typography.pxToRem(52),
        maxWidth: theme.typography.pxToRem(70),
    },
});

class D2ImagePlain extends Component<Props, State> {
    hiddenimageSelectorRef: any;
    imageSelectorOpen: boolean;
    constructor(props: Props) {
        super(props);
        this.state = {
            imageSelectorOpen: false,
        };
    }

    handleImageChange = (e: Object) => {
        this.setState((state) => { state.imageSelectorOpen = false; });
        e.preventDefault();
        const image = e.target.files[0];
        e.target.value = null;

        if (image) {
            this.props.onCommitAsync(() =>
                this.props.mutate({
                    resource: 'fileResources',
                    type: 'create',
                    data: { file: image },
                }).then((response: any) => {
                    const fileResource = response && response.response && response.response.fileResource;
                    if (fileResource) {
                        inMemoryFileStore.set(fileResource.id, image);
                        const imageUrl = inMemoryFileStore.get(fileResource.id);
                        return {
                            name: fileResource.name,
                            value: fileResource.id,
                            url: imageUrl,
                            previewUrl: imageUrl,
                        };
                    }
                    return null;
                }));
        }
    }
    handleButtonClick = () => {
        this.hiddenimageSelectorRef.click();
        this.setState((state) => { state.imageSelectorOpen = true; });
    }

    handleCancel = () => {
        this.setState((state) => { state.imageSelectorOpen = false; });
    }

    handleRemoveClick = () => {
        this.props.onBlur(null);
    }

    handleBlur = () => {
        if (!this.state.imageSelectorOpen) {
            this.props.onBlur(this.getImageUrl());
        }
    }

    getImageUrl = () => {
        const value = this.props.value;
        if (value) {
            return value.url || inMemoryFileStore.get(value.value);
        }
        return null;
    }

    getPreviewUrl = () => {
        const value = this.props.value;
        if (value) {
            return value.previewUrl || inMemoryFileStore.get(value.value);
        }
        return null;
    }

    render = () => {
        const { value, classes, asyncUIState, orientation, disabled } = this.props;
        const isVertical = orientation === orientations.VERTICAL;
        const isUploading = asyncUIState && asyncUIState.loading;
        const imageUrl = this.getImageUrl();
        const previewUrl = this.getPreviewUrl();
        // $FlowFixMe[prop-missing] automated comment
        const containerClass = isVertical ? classes.verticalContainer : classes.horizontalContainer;
        // $FlowFixMe[prop-missing] automated comment
        const selectedImageTextContainerClass = isVertical ? classes.verticalSelectedImageTextContainer : classes.horizontalSelectedImageTextContainer;
        return (
            <div onBlur={this.handleBlur}>
                <input
                    className={classes.input}
                    type="file"
                    accept="image/*"
                    ref={(hiddenimageSelector) => {
                        this.hiddenimageSelectorRef = hiddenimageSelector;
                    }}
                    onChange={e => this.handleImageChange(e)}
                    onCancel={this.handleCancel} // eslint-disable-line react/no-unknown-property
                />
                {
                    (() => {
                        if (isUploading) {
                            return (
                                <div className={containerClass}>
                                    <div className={classes.innerContainer}>
                                        <CircularLoader />
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
                                                rel="noopener noreferrer"
                                                onBlur={(event) => { event.stopPropagation(); }}
                                            >
                                                <img src={previewUrl} alt="" className={classes.image} />
                                            </a>
                                        </div>
                                    }
                                    <div className={selectedImageTextContainerClass}>
                                        <IconCheckmark24 color={colors.green600} />
                                        {!isVertical ?
                                            value.name :
                                            <a
                                                target="_blank"
                                                href={imageUrl}
                                                rel="noopener noreferrer"
                                            >
                                                {value.name}
                                            </a>
                                        }
                                        {` ${i18n.t('selected')}.`}
                                    </div>
                                    <div className={classes.innerContainer}>
                                        <LinkButton
                                            disabled={disabled}
                                            className={classes.deleteButton}
                                            onClick={this.handleRemoveClick}
                                        >
                                            {i18n.t('Delete')}
                                        </LinkButton>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div>
                                <Button
                                    disabled={disabled}
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

export const D2Image = withStyles(styles)(withApiUtils(D2ImagePlain));
