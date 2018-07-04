// @flow
import React, { Component } from 'react';
import Button from '../../Buttons/Button.component';
import contextTypes from '../../D2Form/contextTypes.const';
import { getApi } from '../../../d2/d2Instance';


type fileContainer = {
    fileInfo: ?Object,
    data: ?string,
    isNew?: ?boolean,
    isLoading?: boolean,
};

type Props = {
    label?: ?string,
    value: ?fileContainer,
    file?: ?File,
    onBlur: (value: string) => void,
    onCommitAsync: (callback: Function) => void,
}

type State = {
    internalError?: ?string,
    file?: ?File,
}

class D2File extends Component<Props, State> {
    static defaultLabelStyle = {

    };

    static defaultHiddenFileInputStyle = {
        display: 'none',
    };

    static defaultFileContainer = {
        paddingTop: 5,
    };

    static defaultButtonContainerStyle = {
        display: 'flex',
    };

    static defaultFileInputButtonContainerStyle = {
        display: 'flex',
        paddingTop: 5,
        paddingBottom: 5,
    };

    static defaultFileInputButtonStyle = {

    };

    static defaultFileInputRemoveButtonStyle = {
        marginLeft: 10,
    };

    static defaultLoadingIndicatorContainerPage = {
        paddingLeft: 85,
    };

    state: State;
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
        this.state = { internalError: null, file: null };
    }

    handleImageChange(e: Object) {
        e.preventDefault();
        const file = e.target.files[0];

        if (file) {
            this.props.onCommitAsync(() => {
                const formData = new FormData();
                formData.append('file', file);
                return getApi().post('fileResources', formData).then((response: any) => {
                    const fileResource = response && response.response && response.response.fileResource;
                    if (fileResource) {
                        return { name: fileResource.name, value: fileResource.id };
                    }
                });
            });
            this.setState({ file });
        }
    }
    handleButtonClick() {
        this.hiddenFileSelectorRef.click();
    }

    handleRemoveClick() {
        this.setState({ file: null });
    }

    render() {
        const { label, value, file } = this.props;
        return (
            <div ref={(containerInstance) => { this.materialUIContainerInstance = containerInstance; }}>
                <div>
                    {label || ''}
                </div>
                <div style={D2File.defaultFileInputButtonContainerStyle}>
                    <input
                        style={D2File.defaultHiddenFileInputStyle}
                        type="file"
                        accept="image/*"
                        ref={(hiddenFileSelector) => {
                            this.hiddenFileSelectorRef = hiddenFileSelector;
                        }}
                        onChange={e => this.handleImageChange(e)}
                    />
                    <Button
                        label={this.state.file ? 'Change' : 'Select'}
                        onClick={this.handleButtonClick}
                        style={D2File.defaultFileInputButtonStyle}
                        variant="raised"
                    >
                        {file ? 'Change' : 'Select'}
                    </Button>
                    {
                        (() => {
                            if (this.state.file) {
                                return (
                                    <Button
                                        label={'Remove'}
                                        onClick={this.handleRemoveClick}
                                        style={D2File.defaultFileInputRemoveButtonStyle}
                                        variant="raised"
                                    >
                                        {'Remove'}
                                    </Button>
                                );
                            }
                        })()
                    }
                </div>
                {
                    (() => {
                        if (value && value.isLoading) {
                            return (
                                <div style={D2File.defaultLoadingIndicatorContainerPage} />
                            );
                        }

                        if (this.state.file) {
                            return (
                                <a style={D2File.defaultFileContainer} href="www.vg.no">
                                    {this.state.file.name}
                                </a>
                            );
                        }
                    })()
                }

                <div>
                    {this.state.internalError}
                </div>

            </div>
        );
    }
}

export default D2File;
