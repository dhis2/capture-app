// @flow
import { Input } from '@dhis2/ui';
import React, { Component } from 'react';

type Props = {
    onChange?: ?(value: string, event: HTMLInputElement) => void,
    onBlur?: ?(value: string, event: HTMLInputElement) => void,
    value: ?string,
};

export class D2TextField extends Component<Props> {
    materialUIInstance: ?HTMLInputElement;
    materialUIContainerInstance: ?HTMLDivElement;
    static defaultProps = {
        value: '',
    };

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleChange = (event: HTMLInputElement) => {
        this.props.onChange && this.props.onChange(event.value, event);
    }

    handleBlur = (event: HTMLInputElement) => {
        this.props.onBlur && this.props.onBlur(event.value, event);
    }

    focus() {
        this.materialUIInstance && this.materialUIInstance.focus();
    }

    render() {
        const { onChange, onBlur, value, ...passOnProps } = this.props;

        return (
            <div ref={(containerInstance) => { this.materialUIContainerInstance = containerInstance; }}>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <Input
                    inputRef={(inst) => { this.materialUIInstance = inst; }}
                    value={value || ''}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    {...passOnProps}
                />
            </div>
        );
    }
}
