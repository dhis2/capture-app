import React from 'react';
import { EmptyOnlyFilter } from './EmptyOnlyFilter.component';
import type { EmptyOnlyFilterData } from './types';
import { EMPTY_VALUE_FILTER, NOT_EMPTY_VALUE_FILTER } from '../EmptyValue';
import type { Value } from './EmptyOnly.types';

type Props = {
    filter: EmptyOnlyFilterData | null | undefined;
    filterTypeRef: (instance: unknown) => void;
    handleCommitValue: () => void;
};

type State = {
    value: Value;
};

export class EmptyOnlyFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: EmptyOnlyFilterData | null | undefined): State {
        if (filter?.isEmpty === true) return { value: EMPTY_VALUE_FILTER };
        if (filter?.isEmpty === false) return { value: NOT_EMPTY_VALUE_FILTER };
        return { value: undefined };
    }

    constructor(props: Props) {
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
            <EmptyOnlyFilter
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
