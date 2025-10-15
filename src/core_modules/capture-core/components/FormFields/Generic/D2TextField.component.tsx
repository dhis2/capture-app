import { Input } from '@dhis2/ui';
import React, { Component } from 'react';

type Props = {
    onChange?: (value: string, event: HTMLInputElement) => void;
    onBlur?: (value: string, event: HTMLInputElement) => void;
    value?: string;
    placeholder?: string;
    dataTest?: string;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export class D2TextField extends Component<Props> {
    static defaultProps = {
        value: '',
    };

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }
    instance: HTMLInputElement | null = null;
    containerInstance: HTMLDivElement | null = null;

    handleChange = (payload: { value?: string }, event: any) => {
        this.props.onChange && this.props.onChange(payload.value || '', event);
    }

    handleBlur = (payload: { value?: string }, event: any) => {
        this.props.onBlur && this.props.onBlur(payload.value || '', event);
    }

    focus() {
        this.instance && this.instance.focus();
    }

    render() {
        const { onChange, onBlur, value, ...passOnProps } = this.props;

        return (
            <div ref={(containerInstance) => { this.containerInstance = containerInstance; }}>
                <Input
                    ref={(inst: any) => { this.instance = inst; }}
                    value={value || ''}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    {...passOnProps}
                />
            </div>
        );
    }
}
