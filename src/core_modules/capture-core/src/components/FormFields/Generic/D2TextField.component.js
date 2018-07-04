// @flow
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

type Props = {
    onChange?: ?(value: string, event: SyntheticEvent<HTMLInputElement>) => void,
    onBlur?: ?(value: string, event: SyntheticEvent<HTMLInputElement>) => void,
};

class D2TextField extends Component<Props> {
    static defaultProps = {
        value: '',
    };

    materialUIInstance: ?HTMLInputElement;
    materialUIContainerInstance: ?HTMLDivElement;

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
        this.props.onChange && this.props.onChange(event.currentTarget.value, event);
    }

    handleBlur = (event: SyntheticEvent<HTMLInputElement>) => {
        this.props.onBlur && this.props.onBlur(event.currentTarget.value, event);
    }

    focus() {
        this.materialUIInstance && this.materialUIInstance.focus();
    }

    render() {
        const { onChange, onBlur, ...passOnProps } = this.props;

        return (
            <div ref={(containerInstance) => { this.materialUIContainerInstance = containerInstance; }}>
                <TextField
                    inputRef={(inst) => { this.materialUIInstance = inst; }}
                    {...passOnProps}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                />
            </div>
        );
    }
}

export default D2TextField;
