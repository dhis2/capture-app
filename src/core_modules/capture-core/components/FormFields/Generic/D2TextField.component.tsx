import { Input } from '@dhis2/ui';
import React, { Component } from 'react';

type Props = {
    onChange?: (value: string, event: HTMLInputElement) => void;
    onBlur?: (value: string, event: HTMLInputElement) => void;
    value?: string;
    placeholder?: string;
    dataTest?: string;
    onKeyDown?: (payload: { value?: string }, event: React.KeyboardEvent<HTMLInputElement>) => void;
};

/** Ref from @dhis2/ui Input: class instance with internal inputRef, not a DOM element */
interface D2UIInputInstance {
    inputRef?: React.RefObject<HTMLInputElement | null>;
    focus?(): void;
}

export class D2TextField extends Component<Props> {
    static defaultProps = {
        value: '',
    };

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }
    instance: D2UIInputInstance | null = null;

    handleChange = (payload: { value?: string }, event: any) => {
        this.props.onChange && this.props.onChange(payload.value || '', event);
    }

    handleBlur = (payload: { value?: string }, event: any) => {
        this.props.onBlur && this.props.onBlur(payload.value || '', event);
    }

    focus() {
        this.instance?.inputRef?.current?.focus();
    }

    render() {
        const { onChange, onBlur, value, ...passOnProps } = this.props;

        return (
            <div>
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
