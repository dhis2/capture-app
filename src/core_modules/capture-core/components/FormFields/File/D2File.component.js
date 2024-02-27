// @flow
import { IconCheckmark24, colors, CircularLoader, Button } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { orientations } from 'capture-ui';
import { inMemoryFileStore } from '../../DataEntry/file/inMemoryFileStore';
import { LinkButton } from '../../Buttons/LinkButton.component';
import { withApiUtils } from '../../../HOC';

type Props = {
    value: ?{ value: string, name: string, url?: ?string },
    disabled?: ?boolean,
    classes: {
        horizontalContainer: string,
        verticalContainer: string,
        innerContainer: string,
        horizontalSelectedFileTextContainer: string,
        verticalSelectedFileTextContainer: string,
        deleteButton: string,
        input: string,
        horizontalLink: string,
    },
    onCommitAsync: (callback: Function) => void,
    onBlur: (value: ?Object) => void,
    asyncUIState: { loading?: ?boolean },
    orientation: $Values<typeof orientations>,
    mutate: (data: any) => Promise<any>
}

type State = {
    fileSelectorOpen: boolean,
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

class D2FilePlain extends Component<Props, State> {
    hiddenFileSelectorRef: any;
    fileSelectorOpen: boolean;
    constructor(props: Props) {
        super(props);
        this.state = {
            fileSelectorOpen: false,
        };
    }

    handleFileChange = (e: Object) => {
        this.setState((state) => { state.fileSelectorOpen = false; });
        e.preventDefault();
        const file = e.target.files[0];
        e.target.value = null;

        if (file) {
            this.props.onCommitAsync(() =>
                this.props.mutate({
                    resource: 'fileResources',
                    type: 'create',
                    data: { file },
                }).then((response: any) => {
                    const fileResource = response && response.response && response.response.fileResource;
                    if (fileResource) {
                        inMemoryFileStore.set(fileResource.id, file);
                        return { name: fileResource.name, value: fileResource.id };
                    }
                    return null;
                }));
        }
    }
    handleButtonClick = () => {
        this.hiddenFileSelectorRef.click();
        this.setState((state) => { state.fileSelectorOpen = true; });
    }

    handleCancel = () => {
        this.setState((state) => { state.fileSelectorOpen = false; });
    }

    handleRemoveClick = () => {
        this.props.onBlur(null);
    }

    handleBlur = () => {
        if (!this.state.fileSelectorOpen) {
            this.props.onBlur(this.getFileUrl());
        }
    }

    getFileUrl = () => {
        const value = this.props.value;
        if (value) {
            return value.url || inMemoryFileStore.get(value.value);
        }
        return null;
    }

    render() {
        const { value, classes, asyncUIState, orientation, disabled } = this.props;
        const isUploading = asyncUIState && asyncUIState.loading;
        const fileUrl = this.getFileUrl();
        const isVertical = orientation === orientations.VERTICAL;
        const containerClass = isVertical ? classes.verticalContainer : classes.horizontalContainer;
        const selectedFileTextContainerClass = isVertical ? classes.verticalSelectedFileTextContainer : classes.horizontalSelectedFileTextContainer;
        return (
            <div onBlur={this.handleBlur}>
                <input
                    className={classes.input}
                    type="file"
                    ref={(hiddenFileSelector) => {
                        this.hiddenFileSelectorRef = hiddenFileSelector;
                    }}
                    onChange={e => this.handleFileChange(e)}
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
                                    <div className={classes.innerContainer}>{i18n.t('Uploading file')}</div>
                                </div>
                            );
                        } else if (value) {
                            return (
                                <div className={containerClass}>
                                    <div className={selectedFileTextContainerClass}>
                                        <IconCheckmark24 color={colors.green600} />
                                        <a
                                            className={!isVertical && classes.horizontalLink}
                                            target="_blank"
                                            href={fileUrl}
                                            rel="noopener noreferrer"
                                            onBlur={(event) => { event.stopPropagation(); }}
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
                                <Button
                                    onClick={this.handleButtonClick}
                                    color="primary"
                                    disabled={disabled}
                                >
                                    {i18n.t('Select file')}
                                </Button>
                            </div>

                        );
                    })()
                }
            </div>
        );
    }
}

export const D2File = withStyles(styles)(withApiUtils(D2FilePlain));
