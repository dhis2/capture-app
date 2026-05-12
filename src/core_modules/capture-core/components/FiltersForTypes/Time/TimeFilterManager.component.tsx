import * as React from 'react';
import { TimeFilter as TimeFilterInput } from './TimeFilter.component';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';
import type { TimeFilter, TimeFilterManagerProps, Value } from './time.types';

type State = {
    value?: Value;
};

export class TimeFilterManager extends React.Component<TimeFilterManagerProps, State> {
    static calculateDefaultState(filter?: TimeFilter | null): Value {
        if (!filter) return null;
        if (isEmptyFilterData(filter)) return getEmptyValueFilterValue(filter);

        const from = filter.ge ?? null;
        const to = filter.le ?? null;

        if (!from && !to) {
            return null;
        }

        return { from, to };
    }

    constructor(props: TimeFilterManagerProps) {
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
            <TimeFilterInput
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
