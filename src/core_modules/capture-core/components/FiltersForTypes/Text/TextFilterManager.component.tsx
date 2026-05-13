import * as React from 'react';
import { TextFilter as TextFilterInput } from './TextFilter.component';
import type { TextFilter, TextFilterManagerProps, Value } from './text.types';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';

type State = {
    value: Value;
};

export class TextFilterManager extends React.Component<TextFilterManagerProps, State> {
    static calculateDefaultState(filter: TextFilter | null | undefined) {
        if (!filter) return { value: undefined };
        if (isEmptyFilterData(filter)) return { value: getEmptyValueFilterValue(filter) };
        return { value: filter.value || undefined };
    }

    constructor(props: TextFilterManagerProps) {
        super(props);
        this.state = TextFilterManager.calculateDefaultState(this.props.filter);
    }

    handleCommitValue = (value: Value, isBlur?: boolean) => {
        this.setState({ value });
        this.props.handleCommitValue?.(value, isBlur);
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            <TextFilterInput
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
