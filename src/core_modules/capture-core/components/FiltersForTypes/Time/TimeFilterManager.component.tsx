import * as React from 'react';
import { TimeFilter as TimeFilterInput } from './TimeFilter.component';
import { getEmptyValueFilterValue } from '../EmptyValue';
import type { TimeFilter, Value } from './time.types';

type Props = {
    filter?: TimeFilter | null;
    filterTypeRef: (instance: any) => void;
    handleCommitValue: (value?: Value | null) => void;
};

type State = {
    value?: Value;
};

export class TimeFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter?: TimeFilter | null): Value {
        if (!filter) {
            return null;
        }

        if ('isEmpty' in filter) {
            return getEmptyValueFilterValue(filter);
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
            <TimeFilterInput
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
