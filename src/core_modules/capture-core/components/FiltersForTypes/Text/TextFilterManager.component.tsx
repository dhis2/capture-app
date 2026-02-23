import * as React from 'react';
import { TextFilter } from './TextFilter.component';
import type { TextFilterData } from './types';
import { EMPTY_VALUE_FILTER, NOT_EMPTY_VALUE_FILTER } from '../EmptyValue';

type Props = {
    filter: TextFilterData | null | undefined;
    filterTypeRef: (instance: unknown) => void;
    onValueChange?: () => void;
    handleCommitValue: (value?: string | null) => void;
};

type State = {
    value: string | null | undefined;
};

export class TextFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: TextFilterData | null | undefined) {
        if (filter?.isEmpty === true) return { value: EMPTY_VALUE_FILTER };
        if (filter?.isEmpty === false) return { value: NOT_EMPTY_VALUE_FILTER };

        return { value: filter?.value || undefined };
    }

    constructor(props: Props) {
        super(props);
        this.state = TextFilterManager.calculateDefaultState(this.props.filter);
    }

    handleValueChange = (value: string | null | undefined) => {
        this.setState({ value });
        this.props.onValueChange?.();
    };

    handleCommitValue = (value: string | null | undefined) => {
        this.setState({ value });
        this.props.handleCommitValue?.(value);
    };

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            <TextFilter
                value={this.state.value}
                ref={filterTypeRef}
                onValueChange={this.handleValueChange}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
