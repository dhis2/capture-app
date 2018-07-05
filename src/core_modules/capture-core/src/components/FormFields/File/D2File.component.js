// @flow
import CheckIcon from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core/styles';
import withLoadingIndicator from '../../../HOC/withLoadingIndicator';
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import BorderBox from '../../BorderBox/borderBox.component';
import Button from '../../Buttons/Button.component';
import { getApi } from '../../../d2/d2Instance';

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
    },
    fileInputDeleteButton: {
        marginLeft: theme.typography.pxToRem(10),
        color: theme.palette.error.main,
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
                        const val = { name: fileResource.name, value: fileResource.id };
                        return new Promise(resolve => setTimeout(() => resolve(val), 5000));
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
                            if (value) {
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
