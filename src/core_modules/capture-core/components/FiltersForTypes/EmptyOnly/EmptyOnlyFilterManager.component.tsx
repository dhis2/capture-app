import React from 'react';
import { EmptyOnlyFilter as EmptyOnlyFilterInput } from './EmptyOnlyFilter.component';
import type { EmptyOnlyFilter, EmptyOnlyFilterManagerProps, Value } from './emptyOnly.types';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';

type State = {
    value: Value;
};

export class EmptyOnlyFilterManager extends React.Component<EmptyOnlyFilterManagerProps, State> {
    static calculateDefaultState(filter: EmptyOnlyFilter | null | undefined): State {
        if (!filter) return { value: undefined };
        if (isEmptyFilterData(filter)) return { value: getEmptyValueFilterValue(filter) };
        return { value: undefined };
    }

    constructor(props: EmptyOnlyFilterManagerProps) {
        super(props);
        this.state = EmptyOnlyFilterManager.calculateDefaultState(this.props.filter);
    }

    handleCommitValue = (value: Value) => {
        this.setState({ value });
        this.props.handleCommitValue?.();
    };

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            <EmptyOnlyFilterInput
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
