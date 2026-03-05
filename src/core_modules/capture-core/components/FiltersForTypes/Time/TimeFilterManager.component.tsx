import * as React from 'react';
import { TimeFilter } from './TimeFilter.component';
import type { TimeFilterData } from './types/time.types';
import type { Value } from './Time.types';

type Props = {
    filter?: TimeFilterData | null;
    filterTypeRef: (instance: any) => void;
    handleCommitValue: () => void;
};

type State = {
    value?: Value;
};

export class TimeFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter?: TimeFilterData | null): Value {
        if (!filter) {
            return null;
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
        this.props.handleCommitValue();
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
