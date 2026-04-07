import * as React from 'react';
import { TimeFilter } from './TimeFilter.component';
import { EMPTY_VALUE_FILTER, NOT_EMPTY_VALUE_FILTER } from '../EmptyValue';
import type { TimeFilterData, Value } from './time.types';

type Props = {
    filter?: TimeFilterData | null;
    filterTypeRef: (instance: any) => void;
    handleCommitValue: (value?: Value | null) => void;
};

type State = {
    value?: Value;
};

export class TimeFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter?: TimeFilterData | null): Value {
        if (!filter) {
            return null;
        }

        if ('isEmpty' in filter) {
            return filter.isEmpty ? EMPTY_VALUE_FILTER : NOT_EMPTY_VALUE_FILTER;
        }

        const from = filter.ge ?? null;
        const to = filter.le ?? null;

        if (!from && !to) {
            return null;
        }

        return { from, to };
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            value: TimeFilterManager.calculateDefaultState(this.props.filter),
        };
    }

    handleCommitValue = (value?: Value | null) => {
        this.setState({ value });
        this.props.handleCommitValue(value);
    };

    render() {
        const { filter, filterTypeRef, handleCommitValue, ...passOnProps } = this.props;

        return (
            <TimeFilter
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
